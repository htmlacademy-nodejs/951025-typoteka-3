const {HttpCode} = require(`../../const`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const article = service.getOne(articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with id: ${articleId} is not found`);
  }

  res.locals.article = article;
  return next();
};
