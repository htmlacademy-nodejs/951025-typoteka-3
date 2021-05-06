const {Router} = require(`express`);
const arcticlesRoutes = new Router();

arcticlesRoutes.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
arcticlesRoutes.get(`/add`, (req, res) => res.send(`/articles/add`));
arcticlesRoutes.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
arcticlesRoutes.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = arcticlesRoutes;
