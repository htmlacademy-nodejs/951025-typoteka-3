const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {modifiedArticle} = require(`../helpers/articles`);
const myRoutes = new Router();

myRoutes.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`my`, {articles: articles.map(modifiedArticle)});
  } catch (error) {
    console.log(error);
  }
});

myRoutes.get(`/comments`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`comments`, {articles: articles.map(modifiedArticle)});
  } catch (error) {
    console.log(error);
  }
});

module.exports = myRoutes;
