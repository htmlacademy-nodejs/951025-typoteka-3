class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  getAll() {
    return this._articles.reduce((acc, article) => {
      article.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());
  }
}

module.exports = CategoryService;
