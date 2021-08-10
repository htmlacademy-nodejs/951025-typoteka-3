const {API_PREFIX, DEFAULT_PORT, HttpCode} = require(`../../const`);
const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);

const NOT_FOUND_MESSAGE = `Not found`;

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(NOT_FOUND_MESSAGE));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        console.error(chalk.red(`There are problems on server: ${err}`));
      }

      console.log(chalk.green(`Server is started on port ${port}`));
    });
  }
};
