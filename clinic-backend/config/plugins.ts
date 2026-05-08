export default () => ({
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 1000 * 60 * 60 * 24 * 30,
        },
      },
      breakpoints: {
        xlarge: 1600,
        large: 1200,
        medium: 768,
        small: 480,
        xsmall: 64,
      },
    },
  },
});
