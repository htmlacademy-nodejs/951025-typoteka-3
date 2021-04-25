const {DEFAULT_PORT, HttpCode} = require(`../../const`);
const chalk = require(`chalk`);
const fs = require(`fs/promises`);
const http = require(`http`);
const path = require(`path`);

const MOCK_URL = path.join(__dirname, `../mocks.json`);

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <title>Personal blogs</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessage = `<p>Page not found</p>`;

  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(MOCK_URL, `utf-8`);
        const parsedContent = JSON.parse(content);
        const message = parsedContent.map((item) => `<li>${item.title}</li>`).join(``);
        const responseMessage = `<ul>${message}</ul>`;
        sendResponse(res, HttpCode.OK, responseMessage);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Нет подключения к серверу, порт: ${port}`));
        }
        return console.info(chalk.blue(`Ожидаю подключения к серверу на порту ${port}`));
      })
      .on(`connection`, () => {
        return console.info(chalk.green(`Подлючение установлено`));
      });
  }
};
