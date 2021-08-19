const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: `info`,
});

// console.log(logger.name); // Почему undefined ?

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
