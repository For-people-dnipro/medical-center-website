type CacheEntry = {
  status: number;
  body: unknown;
  type?: string;
  expiresAt: number;
};

const publicApiCache = new Map<string, CacheEntry>();

let publicContentVersion = Date.now().toString(36);

export const CACHEABLE_PREFIXES = [
  '/api/doctors',
  '/api/branches',
  '/api/specialisations',
  '/api/specializations',
  '/api/news',
  '/api/news-items',
  '/api/themes',
  '/api/homepage',
  '/api/homepages',
  '/api/home-slider',
  '/api/home-sliders',
  '/api/service-prices',
  '/api/vacancies',
];

export function isCacheableRequest(ctx: any) {
  if (ctx.method !== 'GET') return false;
  return CACHEABLE_PREFIXES.some(
    (prefix) => ctx.path === prefix || ctx.path.startsWith(`${prefix}/`),
  );
}

export function getPublicApiCacheEntry(key: string) {
  return publicApiCache.get(key);
}

export function setPublicApiCacheEntry(key: string, entry: CacheEntry) {
  publicApiCache.set(key, entry);
}

export function deletePublicApiCacheEntry(key: string) {
  publicApiCache.delete(key);
}

export function clearPublicApiCache() {
  publicApiCache.clear();
  publicContentVersion = Date.now().toString(36);
}

export function getPublicContentVersion() {
  return publicContentVersion;
}
