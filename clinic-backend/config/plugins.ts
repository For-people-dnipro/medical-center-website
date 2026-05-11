export default ({ env }) => {
  const uploadProvider = env('UPLOAD_PROVIDER', 'local');

  const sharedUploadConfig = {
    breakpoints: {
      xlarge: 1600,
      large: 1200,
      medium: 768,
      small: 480,
      xsmall: 64,
    },
  };

  if (uploadProvider === 'aws-s3') {
    return {
      upload: {
        config: {
          provider: 'aws-s3',
          providerOptions: {
            baseUrl: env('CDN_URL', undefined),
            rootPath: env('CDN_ROOT_PATH', undefined),
            s3Options: {
              credentials: {
                accessKeyId: env('AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('AWS_ACCESS_SECRET'),
              },
              region: env('AWS_REGION', 'auto'),
              endpoint: env('AWS_ENDPOINT'),
              params: {
                ACL: env('AWS_ACL', 'public-read'),
                signedUrlExpires: env.int('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                Bucket: env('AWS_BUCKET'),
              },
            },
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
          ...sharedUploadConfig,
        },
      },
    };
  }

  return {
    upload: {
      config: {
        providerOptions: {
          localServer: {
            maxage: 1000 * 60 * 60 * 24 * 30,
          },
        },
        ...sharedUploadConfig,
      },
    },
  };
};
