const packageJSONfile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJSONfile.version;
    console.info(version);
  }
};
