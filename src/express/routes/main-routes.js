const {Router} = require(`express`);
const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => res.send(`/`));
mainRoutes.get(`/register`, (req, res) => res.send(`/register`));
mainRoutes.get(`/login`, (req, res) => res.send(`/login`));

module.exports = mainRoutes;
