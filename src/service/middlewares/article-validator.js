const {HttpCode} = require(`../../const`);
const articleKeys = [`announce`, `category`, `createdDate`, `fullText`, `title`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Not enough article's parameters. Bad request`);
  }

  next();
};
