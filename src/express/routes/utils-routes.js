const {Router} = require(`express`);
const utilsRoutes = new Router();

utilsRoutes.get(`/categories`, (req, res) => res.send(`/categories`));
utilsRoutes.get(`/search`, (req, res) => res.send(`/search`));

module.exports = utilsRoutes;
