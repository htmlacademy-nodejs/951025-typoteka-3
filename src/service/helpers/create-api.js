const express = require(`express`);
const fillDb = require(`../lib/fill-db`);

const createApi = async (apiType, services, mockDb, mockData) => {
  const app = express();
  app.use(express.json());
  await fillDb(mockDb, mockData);
  apiType(app, ...services);
  return app;
};

module.exports = createApi;
