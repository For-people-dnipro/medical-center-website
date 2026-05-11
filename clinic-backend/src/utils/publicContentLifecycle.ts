import { clearPublicApiCache } from './publicApiCache';

export default {
  async afterCreate() {
    clearPublicApiCache();
  },

  async afterCreateMany() {
    clearPublicApiCache();
  },

  async afterUpdate() {
    clearPublicApiCache();
  },

  async afterUpdateMany() {
    clearPublicApiCache();
  },

  async afterDelete() {
    clearPublicApiCache();
  },

  async afterDeleteMany() {
    clearPublicApiCache();
  },
};
