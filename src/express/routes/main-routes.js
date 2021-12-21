const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {modifiedArticle} = require(`../helpers/articles`);
const mainRoutes = new Router();

const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  try {
    const [{count, articles}, categories, comments] = await Promise.all([
      api.getArticles({limit, offset}),
      api.getCategories(true),
      api.getComments(3),
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    res.render(`main`, {articles: articles.map(modifiedArticle), page, totalPages, categories, comments});
  } catch (error) {
    console.log(error);
  }
});

mainRoutes.get(`/categories`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories});
  } catch (error) {
    next(error);
  }
});

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
