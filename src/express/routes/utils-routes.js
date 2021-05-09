const {Router} = require(`express`);
const utilsRoutes = new Router();

utilsRoutes.get(`/categories`, (req, res) => res.render(`all-categories`));
utilsRoutes.get(`/search`, (req, res) => res.render(`search`));

module.exports = utilsRoutes;
