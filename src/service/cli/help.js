const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.info(`
        ${chalk.yellow.bold.underline(`Программа запускает http-сервер и формирует файл с данными для API.`)}

        Гайд:
        service.js <command>
        Команды:
        ${chalk.bgGray(`--version:`)}            выводит номер версии
        ${chalk.bgGray(`--help:`)}               печатает этот текст
        ${chalk.bgGray(`--generate <count>`)}    формирует файл mocks.json
    `);
  }
};
