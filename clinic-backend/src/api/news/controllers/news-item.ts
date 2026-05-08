/**
 * news controller
 */

import { factories } from '@strapi/strapi';

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function mapTheme(theme: Record<string, unknown> | null | undefined) {
  if (!theme) return null;

  return {
    id: theme.id ?? theme.documentId ?? null,
    documentId: theme.documentId ?? null,
    name: toText(theme.name),
    slug: toText(theme.slug),
    description: toText(theme.description),
  };
}

function mapCoverImage(image: Record<string, unknown> | null | undefined) {
  if (!image) return null;

  return {
    id: image.id ?? image.documentId ?? null,
    documentId: image.documentId ?? null,
    name: toText(image.name),
    alternativeText: toText(image.alternativeText),
    caption: toText(image.caption),
    width: image.width ?? null,
    height: image.height ?? null,
    formats: image.formats ?? null,
    mime: toText(image.mime),
    url: toText(image.url),
  };
}

function mapPublicNewsItem(item: Record<string, unknown>) {
  return {
    id: item.id ?? item.documentId ?? null,
    documentId: item.documentId ?? null,
    title: toText(item.title),
    slug: toText(item.slug),
    short_description: toText(item.short_description),
    content: Array.isArray(item.content) ? item.content : [],
    published_date: item.published_date ?? null,
    publishedAt: item.publishedAt ?? null,
    seo_title: toText(item.seo_title),
    seo_description: toText(item.seo_description),
    cover_image: mapCoverImage(item.cover_image as Record<string, unknown>),
    theme: mapTheme(item.theme as Record<string, unknown>),
  };
}

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
          publishedAt: {
            $notNull: true,
          },
        },
        orderBy: [
          { published_date: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        select: [
          'id',
          'documentId',
          'title',
          'slug',
          'short_description',
          'content',
          'published_date',
          'publishedAt',
          'seo_title',
          'seo_description',
        ],
        populate: {
          cover_image: {
            select: [
              'id',
              'documentId',
              'name',
              'alternativeText',
              'caption',
              'width',
              'height',
              'formats',
              'mime',
              'url',
            ],
          },
          theme: {
            select: ['id', 'documentId', 'name', 'slug', 'description'],
          },
        },
      });

      ctx.body = { data: (newsItems || []).map(mapPublicNewsItem) };
    },
  }),
);
