import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const sharp = require("../clinic-backend/node_modules/sharp");

const rootDir = process.cwd();

const IMAGE_JOBS = [
    { file: "public/images/diagnostics-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/consult-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/analyses-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/certificate-injections.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/vacancy-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/declaration-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/consultation-other-doctor.png", maxWidth: 1280 },
    { file: "public/images/analysesInfo.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/consult-docs.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/consultation.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/packages-hero-nurse.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/diagnostics-prepare.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/vaccination-section-picture.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/consultation-before-vaccine.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/manipulation-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/about-us.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/vaccination-hero.jpg", maxWidth: 1600, quality: 76 },
    { file: "public/images/consult-after-vaccine.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/ambulance.jpg", maxWidth: 1280, quality: 78 },
    { file: "public/images/package-services.jpg", maxWidth: 1280, quality: 78 },
];

function formatKb(bytes) {
    return `${(bytes / 1024).toFixed(1)} KB`;
}

async function optimizeImage({ file, maxWidth, quality = 78 }) {
    const absolutePath = path.join(rootDir, file);
    const originalBuffer = await fs.readFile(absolutePath);
    const originalSize = originalBuffer.byteLength;
    const image = sharp(originalBuffer, { failOn: "none" });
    const metadata = await image.metadata();

    let pipeline = image.rotate();

    if (
        Number.isFinite(maxWidth) &&
        maxWidth > 0 &&
        Number.isFinite(metadata.width) &&
        metadata.width > maxWidth
    ) {
        pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const extension = path.extname(file).toLowerCase();
    let outputBuffer;

    if (extension === ".png") {
        outputBuffer = await pipeline
            .png({
                compressionLevel: 9,
                palette: true,
                quality: 80,
                effort: 10,
            })
            .toBuffer();
    } else {
        outputBuffer = await pipeline
            .jpeg({
                quality,
                mozjpeg: true,
                progressive: true,
                chromaSubsampling: "4:2:0",
            })
            .toBuffer();
    }

    if (outputBuffer.byteLength >= originalSize) {
        return {
            file,
            changed: false,
            originalSize,
            optimizedSize: originalSize,
        };
    }

    await fs.writeFile(absolutePath, outputBuffer);

    return {
        file,
        changed: true,
        originalSize,
        optimizedSize: outputBuffer.byteLength,
    };
}

async function main() {
    const results = [];

    for (const job of IMAGE_JOBS) {
        results.push(await optimizeImage(job));
    }

    const changed = results.filter((result) => result.changed);
    const totalSaved = changed.reduce(
        (sum, result) => sum + (result.originalSize - result.optimizedSize),
        0,
    );

    results.forEach((result) => {
        const status = result.changed ? "optimized" : "skipped";
        console.log(
            `${status} ${result.file} ${formatKb(result.originalSize)} -> ${formatKb(result.optimizedSize)}`,
        );
    });

    console.log(
        `saved ${formatKb(totalSaved)} across ${changed.length}/${results.length} files`,
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
