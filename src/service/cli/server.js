const {API_PREFIX, DEFAULT_PORT, HttpCode} = require(`../../const`);
const express = require(`express`);
const {getLogger} = require(`../lib/logger`);
const routes = require(`../api`);

const NOT_FOUND_MESSAGE = `Not found`;

const app = express();
const logger = getLogger({name: `api`});
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(NOT_FOUND_MESSAGE));

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`There are problems on server: ${err.message}`);
        }

        return logger.info(`Server is started on port ${port}`);
      });
    } catch (err) {
      logger.error(`An error is occured: ${err.message}`);
      process.exit(1);
    }
  }
};
