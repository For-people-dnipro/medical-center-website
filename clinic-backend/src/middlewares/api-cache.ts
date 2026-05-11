import {
  deletePublicApiCacheEntry,
  getPublicApiCacheEntry,
  getPublicContentVersion,
  isCacheableRequest,
  setPublicApiCacheEntry,
} from '../utils/publicApiCache';

export default (_config: unknown, { strapi }: { strapi: any }) => {
  const ttlMs = Number(strapi?.config?.get?.('server.apiCacheTtlMs')) || 60 * 1000;

  return async (ctx: any, next: () => Promise<void>) => {
    if (!isCacheableRequest(ctx)) {
      await next();
      return;
    }

    const key = `${ctx.method}:${ctx.url}`;
    const cached = getPublicApiCacheEntry(key);

    if (cached && cached.expiresAt > Date.now()) {
      ctx.status = cached.status;
      ctx.body = cached.body;
      if (cached.type) {
        ctx.type = cached.type;
      }
      ctx.set('X-API-Cache', 'HIT');
      ctx.set('X-Content-Version', getPublicContentVersion());
      return;
    }

    deletePublicApiCacheEntry(key);
    await next();

    if (ctx.status >= 200 && ctx.status < 300 && ctx.body !== undefined) {
      setPublicApiCacheEntry(key, {
        status: ctx.status,
        body: ctx.body,
        type: ctx.type,
        expiresAt: Date.now() + ttlMs,
      });
      ctx.set('X-API-Cache', 'MISS');
      ctx.set('X-Content-Version', getPublicContentVersion());
    }
  };
};
