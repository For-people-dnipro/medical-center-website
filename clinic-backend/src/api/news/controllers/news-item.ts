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
  }),
);
