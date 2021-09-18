const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const dayjs = require(`dayjs`);
const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`main`, {articles: articles.map((article) => {
      article.date = dayjs(article.createdDate).format(`YYYY-MM-DDTHH:mm`);
      article.outputDate = dayjs(article.createdDate).format(`DD.MM.YYYY, HH:mm`);

      return article;
    })});
  } catch (error) {
    console.log(error);
  }
});

mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));

module.exports = mainRoutes;
