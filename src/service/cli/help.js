const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(`
        Программа запускает http-сервер и формирует файл с данными для API.

        Гайд:
        service.js <command>
        Команды:
        --version:            выводит номер версии
        --help:               печатает этот текст
        --generate <count>    формирует файл mocks.json
        --server <port>       запускает сервер
        --fill                заполняет БД
        --filldb              заполняет БД с помощью Sequelize
    `));
  }
};
