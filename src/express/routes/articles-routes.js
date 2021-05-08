const {Router} = require(`express`);
const arcticlesRoutes = new Router();

arcticlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
arcticlesRoutes.get(`/add`, (req, res) => res.render(`new-post`));
arcticlesRoutes.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
arcticlesRoutes.get(`/:id`, (req, res) => res.render(`post`));

module.exports = arcticlesRoutes;
