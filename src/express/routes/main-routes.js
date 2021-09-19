const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {modifiedArticle} = require(`../helpers/articles`);
const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`main`, {articles: articles.map(modifiedArticle)});
  } catch (error) {
    console.log(error);
  }
});

mainRoutes.get(`/categories`, (req, res) => res.render(`all-categories`));

mainRoutes.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);
    res.render(`search`, {results: results.map(modifiedArticle)});
  } catch (error) {
    res.render(`search`, {results: []});
  }
});

mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));

module.exports = mainRoutes;
