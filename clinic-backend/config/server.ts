export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  apiCacheTtlMs: env.int('API_CACHE_TTL_MS', 60 * 1000),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
