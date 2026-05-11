from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
UPLOADS_DIR = ROOT / "clinic-backend" / "public" / "uploads"
RASTER_EXTENSIONS = {".jpg", ".jpeg", ".png"}
JPEG_QUALITY = 76
PNG_MAX_COLORS = 192
MIN_SIZE_BYTES = 350_000


def optimize_raster_image(path: Path) -> tuple[int, int]:
    before = path.stat().st_size

    with Image.open(path) as image:
        save_options: dict[str, object]

        if path.suffix.lower() in {".jpg", ".jpeg"}:
            converted = image.convert("RGB")
            save_options = {
                "format": "JPEG",
                "quality": JPEG_QUALITY,
                "optimize": True,
                "progressive": True,
            }
            converted.save(path, **save_options)
        elif path.suffix.lower() == ".png":
            if image.mode not in {"P", "L"}:
                converted = image.convert("P", palette=Image.Palette.ADAPTIVE, colors=PNG_MAX_COLORS)
            else:
                converted = image

            save_options = {
                "format": "PNG",
                "optimize": True,
            }
            converted.save(path, **save_options)
        else:
            return before, before

    after = path.stat().st_size
    return before, after


def recompress_embedded_jpeg(match: re.Match[str]) -> str:
    encoded = match.group(1)
    raw = base64.b64decode(encoded)

    with Image.open(io.BytesIO(raw)) as image:
        converted = image.convert("RGB")
        output = io.BytesIO()
        converted.save(
            output,
            format="JPEG",
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True,
        )
        recompressed = base64.b64encode(output.getvalue()).decode("ascii")

    return f"data:image/jpeg;base64,{recompressed}"


def optimize_svg(path: Path) -> tuple[int, int]:
    before = path.stat().st_size
    source = path.read_text(encoding="utf-8", errors="ignore")
    optimized = re.sub(
        r"data:image/jpeg;base64,([^\"']+)",
        recompress_embedded_jpeg,
        source,
    )
    optimized = re.sub(r">\s+<", "><", optimized).strip()

    if optimized != source:
        path.write_text(optimized, encoding="utf-8")

    after = path.stat().st_size
    return before, after


def main() -> None:
    total_before = 0
    total_after = 0
    changed_files: list[tuple[Path, int, int]] = []

    for path in sorted(UPLOADS_DIR.iterdir()):
        if not path.is_file():
            continue
        if path.stat().st_size < MIN_SIZE_BYTES:
            continue

        suffix = path.suffix.lower()
        if suffix in RASTER_EXTENSIONS:
            before, after = optimize_raster_image(path)
        elif suffix == ".svg":
            before, after = optimize_svg(path)
        else:
            continue

        total_before += before
        total_after += after

        if after < before:
            changed_files.append((path, before, after))

    print(f"Optimized {len(changed_files)} files")
    print(f"Before: {total_before / 1024 / 1024:.2f} MB")
    print(f"After:  {total_after / 1024 / 1024:.2f} MB")
    print(f"Saved:  {(total_before - total_after) / 1024 / 1024:.2f} MB")

    for path, before, after in changed_files:
        print(
            f"{path.name}: {before / 1024:.1f} KB -> {after / 1024:.1f} KB "
            f"({((before - after) / before) * 100:.1f}% saved)"
        )


if __name__ == "__main__":
    main()
