module.exports = ({ env }) => ({
    email: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: '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',
      },
      settings: {
        defaultFrom: 'no-reply@appets.com.uy',
        defaultReplyTo: 'no-reply@appets.com.uy',
      },
    },
  });
  