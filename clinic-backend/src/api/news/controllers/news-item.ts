/**
 * news controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::news.news-item' as any,
  ({ strapi }) => ({
    async topics(ctx) {
      const themes = await strapi.db.query('api::theme.theme').findMany({
        select: ['id', 'name', 'slug', 'description'],
        orderBy: { name: 'asc' },
      });

      ctx.body = {
        data: (themes || []).map((theme) => ({
          id: theme.id,
          name: theme.name,
          slug: theme.slug,
          description: theme.description || '',
        })),
      };
    },

    async byTheme(ctx) {
      const slug = String(ctx.params?.slug || '').trim().toLocaleLowerCase('uk-UA');

      if (!slug) {
        ctx.body = { data: [] };
        return;
      }

      const theme = await strapi.db.query('api::theme.theme').findOne({
        where: { slug },
        select: ['id', 'name', 'slug', 'description'],
      });

      if (!theme?.id) {
        ctx.body = { data: [] };
        return;
      }

      const newsItems = await strapi.db.query('api::news.news-item').findMany({
        where: {
          theme: theme.id,
        },
        orderBy: [
          { published_date: 'desc' },
          { createdAt: 'desc' },
        ],
        populate: {
          cover_image: true,
          theme: {
            select: ['id', 'name', 'slug', 'description'],
          },
        },
      });

      ctx.body = { data: newsItems || [] };
    },
  }),
);
