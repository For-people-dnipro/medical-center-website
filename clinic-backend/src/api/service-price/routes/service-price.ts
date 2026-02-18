/**
 * service-price router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::service-price.service-price', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
