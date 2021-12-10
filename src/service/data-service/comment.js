const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
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

  async findAllByArticleId(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentService;
