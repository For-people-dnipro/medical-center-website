function toAddressKey(value) {
    const raw = String(value || "").toLowerCase().trim();
    if (!raw) return "";

    return raw
        .replace(/[’']/g, "")
        .replace(/\bм\.?\s*/g, "")
        .replace(/\bмісто\s+/g, "")
        .replace(/\bдніпро,?\s*/g, "")
        .replace(/\bвул\.?\s*/g, "вулиця ")
        .replace(/\bпросп\.?\s*/g, "проспект ")
        .replace(/[^a-zа-яіїєґ0-9\s-]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractHouseNumber(value) {
    const match = String(value || "").match(/\b\d+[a-zа-яіїєґ]?\b/i);
    return match ? match[0].toLowerCase() : "";
}

export const BRANCHES_CATALOG = [
    {
        id: "slava",
        address: "Дніпро, бульвар Слави, 8",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (066) 067-00-37",
        phoneHref: "+380660670037",
        lat: 48.414,
        lng: 35.0659,
        mapLink: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
        mapCenter: { lat: 48.414, lng: 35.0659 },
        mapMarkers: [
            {
                id: "slava",
                lat: 48.414,
                lng: 35.0659,
                link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
            },
        ],
        aliases: ["бульвар слави 8", "слави 8"],
    },
    {
        id: "halytskoho",
        address: "Дніпро, вул. Д. Галицького, 34",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (050) 067-13-88",
        phoneHref: "+380500671388",
        lat: 48.4613,
        lng: 34.9384,
        mapLink: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
        mapCenter: { lat: 48.4613, lng: 34.9384 },
        mapMarkers: [
            {
                id: "halytskoho",
                lat: 48.4613,
                lng: 34.9384,
                link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
            },
        ],
        aliases: ["галицького 34", "данила галицького 34"],
    },
    {
        id: "khmelnytskoho",
        address: "Дніпро, просп. Б. Хмельницького, 127",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (050) 067-22-35",
        phoneHref: "+380500672235",
        lat: 48.4063,
        lng: 35.0014,
        mapLink: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
        mapCenter: { lat: 48.4063, lng: 35.0014 },
        mapMarkers: [
            {
                id: "khmelnytskoho",
                lat: 48.4063,
                lng: 35.0014,
                link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
            },
        ],
        aliases: ["хмельницького 127", "богдана хмельницького 127"],
    },
];

export function findBranchInCatalog({
    id = "",
    slug = "",
    address = "",
    name = "",
} = {}) {
    const safeId = String(id || "").trim().toLowerCase();
    const safeSlug = String(slug || "").trim().toLowerCase();
    const lookupText = `${address} ${name}`.trim();
    const lookupKey = toAddressKey(lookupText);
    const lookupNumber = extractHouseNumber(lookupKey);

    const byIdOrSlug = BRANCHES_CATALOG.find((item) => {
        const itemId = String(item.id || "").toLowerCase();
        return (
            (safeId && safeId === itemId) ||
            (safeSlug && safeSlug === itemId)
        );
    });
    if (byIdOrSlug) return byIdOrSlug;

    if (!lookupKey) return null;

    const direct = BRANCHES_CATALOG.find((item) => {
        const itemKey = toAddressKey(item.address);
        if (itemKey === lookupKey) return true;

        return (item.aliases || []).some((alias) => {
            const aliasKey = toAddressKey(alias);
            return aliasKey && (lookupKey.includes(aliasKey) || aliasKey.includes(lookupKey));
        });
    });
    if (direct) return direct;

    if (!lookupNumber) return null;

    return (
        BRANCHES_CATALOG.find((item) => {
            const itemKey = toAddressKey(item.address);
            const itemNumber = extractHouseNumber(itemKey);
            if (!itemNumber || itemNumber !== lookupNumber) return false;

            return (item.aliases || []).some((alias) => {
                const aliasKey = toAddressKey(alias);
                if (!aliasKey) return false;
                const aliasWithoutNumber = aliasKey.replace(itemNumber, "").trim();
                return aliasWithoutNumber && lookupKey.includes(aliasWithoutNumber);
            });
        }) || null
    );
}
