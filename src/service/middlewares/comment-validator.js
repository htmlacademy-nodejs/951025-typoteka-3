const {HttpCode} = require(`../../const`);
const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const existedKeys = commentKeys.every((key) => keys.includes(key));

  if (!existedKeys) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Not enough comment's parameters. Bad request.`);
  }

  return next();
};
