export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact.submit',
      config: {
        auth: false,
      },
    },
  ],
};
