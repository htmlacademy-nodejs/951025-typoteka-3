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
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  article(app, new ArticleService(mockData), new CommentService());
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
