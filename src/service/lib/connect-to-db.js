const {ExitCode} = require(`../../const`);
const {logger} = require(`../lib/logger`);

module.exports = async (sequelize) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(ExitCode.FAIL);
  }
};
