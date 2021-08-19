const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    article.comments.push(newComment);
    return newComment;
  }

  delete(article, commentId) {
    const deletedComment = article.comments
      .find((comment) => comment.id === commentId);

    if (!deletedComment) {
      return null;
    }

    article.comments = article.comments
      .filter((comment) => comment.id !== commentId);

    return deletedComment;
  }

  getAll(article) {
    return article.comments;
  }
}

module.exports = CommentService;
