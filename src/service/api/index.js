const {
  ArticleService,
  CategoryService,
  CommentService,
  SearchService,
} = require(`../data-service`);

const {Router} = require(`express`);
const article = require(`./article/article`);
const category = require(`./category/category`);
const search = require(`./search/search`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();
defineModels(sequelize);

(async () => {
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
