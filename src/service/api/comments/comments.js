const {Router} = require(`express`);
const {HttpCode} = require(`../../../const`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {limit, withArticles} = req.query;
    const comments = await service.findAll({limit, withArticles});
    return res.status(HttpCode.OK).json(comments);
  });
};
