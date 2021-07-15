const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
    }, article);

    return this._articles.push(newArticle);
  }

  delete(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  getAll() {
    return this._articles;
  }

  getOne(id) {
    return this._articles
      .find((article) => article.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles.find((item) => item.id === id);
    return Object.assign(oldArticle, article);
  }
}

module.exports = ArticleService;