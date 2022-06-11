module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'https://app.presupuestos.com.uy/api',
  admin: {
    url: 'https://app.appets.com.uy/dashboard',
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'eaccf997c229833eda0d409b8a04ff83'),
    },
  },
});

