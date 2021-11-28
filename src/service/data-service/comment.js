const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async delete(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAllByArticleId(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findAll({limit = false, withArticles = false}) {
    const include = [Aliase.USERS];

    if (withArticles) {
      include.push(Aliase.ARTICLES);
    }

    const params = limit ? {limit, include} : {include};
    const comments = await this._Comment.findAll(params);
    return comments;
  }

  findAllByArticleId(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentService;
