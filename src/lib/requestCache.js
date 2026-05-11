const MEMORY_CACHE = new Map();

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const CACHE_PREFIX = "app-cache:";

function now() {
    return Date.now();
}

function makeStorageKey(key) {
    return `${CACHE_PREFIX}${key}`;
}

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readMemory(key) {
    const entry = MEMORY_CACHE.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= now()) {
        MEMORY_CACHE.delete(key);
        return null;
    }
    return entry.value;
}

function writeMemory(key, value, ttlMs) {
    MEMORY_CACHE.set(key, {
        value,
        expiresAt: now() + ttlMs,
    });
}

function readStorage(key) {
    if (!canUseStorage()) return null;

    try {
        const raw = window.localStorage.getItem(makeStorageKey(key));
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;

        if (Number(parsed.expiresAt) <= now()) {
            window.localStorage.removeItem(makeStorageKey(key));
            return null;
        }

        return parsed.value ?? null;
    } catch {
        return null;
    }
}

function writeStorage(key, value, ttlMs) {
    if (!canUseStorage()) return;

    try {
        window.localStorage.setItem(
            makeStorageKey(key),
            JSON.stringify({
                value,
                expiresAt: now() + ttlMs,
            }),
        );
    } catch {
        // Ignore storage quota / serialization errors.
    }
}

export function getCachedValue(key, ttlMs = DEFAULT_TTL_MS) {
    const memoryValue = readMemory(key);
    if (memoryValue !== null) {
        return memoryValue;
    }

    const storageValue = readStorage(key);
    if (storageValue !== null) {
        writeMemory(key, storageValue, ttlMs);
        return storageValue;
    }

    return null;
}

export function setCachedValue(key, value, ttlMs = DEFAULT_TTL_MS) {
    writeMemory(key, value, ttlMs);
    writeStorage(key, value, ttlMs);
    return value;
}

export async function getOrSetCachedValue(key, loader, ttlMs = DEFAULT_TTL_MS) {
    const cached = getCachedValue(key, ttlMs);
    if (cached !== null) {
        return cached;
    }

    const value = await loader();
    return setCachedValue(key, value, ttlMs);
}
