const express = require(`express`);

const app = express();
const DEFAULT_PORT = 8080;

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const arcticlesRoutes = require(`./routes/articles-routes`);
const utilsRoutes = require(`./routes/utils-routes`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, arcticlesRoutes);
app.use(`/`, utilsRoutes);

app.listen(DEFAULT_PORT);
