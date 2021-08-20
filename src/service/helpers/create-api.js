const express = require(`express`);

const createApi = (apiType, services) => {
  const app = express();
  app.use(express.json());
  apiType(app, ...services);
  return app;
};

module.exports = createApi;
