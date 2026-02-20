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
  ],
};
