const express = require(`express`);
const path = require(`path`);
const {Directory, HttpCode} = require(`../const`);

const DEFAULT_PORT = 8080;

const app = express();
app.set(`views`, path.resolve(__dirname, Directory.TEMPLATES));
app.set(`view engine`, `pug`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const arcticlesRoutes = require(`./routes/articles-routes`);

app.use(express.static(path.resolve(__dirname, Directory.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Directory.UPLOAD)));
app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, arcticlesRoutes);
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/400`));

app.use((err, req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT);
