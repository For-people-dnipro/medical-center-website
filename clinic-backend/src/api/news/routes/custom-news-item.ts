export default {
  routes: [
    {
      method: 'GET',
      path: '/news/topics',
      handler: 'news-item.topics',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/news/by-theme/:slug',
      handler: 'news-item.byTheme',
      config: {
        auth: false,
      },
    },
  ],
};
