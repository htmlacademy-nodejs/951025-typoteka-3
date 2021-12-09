const {Router} = require(`express`);
const {HttpCode} = require(`../../../const`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleExists = require(`../../middlewares/article-exists`);
const commentValidator = require(`../../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article with id: ${articleId} is not found`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const existedArticle = await articleService.getOne(articleId);

    if (!existedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article with id: ${articleId} is not found`);
    }

    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.delete(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article is not found`);
    }

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAllByArticleId(article);

    res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment is not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
