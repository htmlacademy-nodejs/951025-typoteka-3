const {HttpCode} = require(`../../const`);
const articleKeys = [`announcement`, `categories`, `fullText`, `title`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Not enough article's parameters. Bad request`);
  }

  return next();
};
