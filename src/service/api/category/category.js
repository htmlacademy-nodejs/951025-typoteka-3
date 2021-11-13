const {Router} = require(`express`);
const {HttpCode} = require(`../../../const`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);

    res.status(HttpCode.OK)
      .json(categories);
  });
};
