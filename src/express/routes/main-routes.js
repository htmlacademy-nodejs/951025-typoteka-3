const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`main`, {articles});
  } catch (error) {
    console.log(error);
  }
});

mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));

module.exports = mainRoutes;
