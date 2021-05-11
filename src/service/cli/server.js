const {DEFAULT_PORT, HttpCode} = require(`../../const`);
const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs/promises`);
const path = require(`path`);

const MOCK_URL = path.join(__dirname, `../mocks.json`);
const NOT_FOUND_MESSAGE = `Not found`;

const app = express();
const postsRoute = new express.Router();

postsRoute.get(`/posts`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_URL);
    const mocks = JSON.parse(content);
    res.send(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(postsRoute);
    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(NOT_FOUND_MESSAGE));

    app.listen(port, (err) => {
      if (err) {
        console.error(chalk.red(`There are problems on server: ${err}`));
      }

      console.log(chalk.green(`Server is started on port ${port}`));
    });
  }
};
