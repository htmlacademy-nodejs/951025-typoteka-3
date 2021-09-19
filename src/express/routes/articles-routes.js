const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {modifiedArticle} = require(`../helpers/articles`);
const arcticlesRoutes = new Router();

const currentPost = async (req, res) => {
  try {
    const article = await api.getArticle(req.params.id);
    res.render(`post`, {article: modifiedArticle(article)});
  } catch (error) {
    console.log(error);
  }
};

arcticlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
arcticlesRoutes.get(`/add`, (req, res) => res.render(`new-post`));
arcticlesRoutes.get(`/edit/:id`, currentPost);
arcticlesRoutes.get(`/:id`, currentPost);

module.exports = arcticlesRoutes;
