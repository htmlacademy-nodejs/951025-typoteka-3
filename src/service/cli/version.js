const chalk = require(`chalk`);
const packageJSONfile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJSONfile.version;
    console.info(chalk.blueBright(version));
  }
};
