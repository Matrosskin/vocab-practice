const { createProxyMiddleware } = require('http-proxy-middleware');

// NOTE: Pay attaintion! Runtime erros in this file will not be shown during start of webpack dev server,
// Webpack prins that the app started successully and available on address, but it is not actually available!!!
// And import of json file did not work somehow...
// const firebaseJson = require('./firebase.json');

module.exports = function(app) {
  app.use(
    '/vp-auth',
    createProxyMiddleware({
      // target: `http://localhost:${firebaseJson.emulators.auth.port}`,
      target: `http://localhost:9099`,
      changeOrigin: true,
      pathRewrite: {
        '^/vp-auth': '',
      },
    })
  );
  app.use(
    '/vp-database',
    createProxyMiddleware({
      // target: `http://localhost:${firebaseJson.emulators.database.port}`,
      target: `http://localhost:9000`,
      changeOrigin: true,
      pathRewrite: {
        '^/vp-database': '',
      },
    })
  );
  app.use(
    '/vp-ui', // Proxying of ui fo emulators is not yet tested.
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/vp-ui': '',
      },
    })
  );
};
