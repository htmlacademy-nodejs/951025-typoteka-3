class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  getAll(searchText) {
    return this._articles
      .filter((article) => article.title.includes(searchText));
  }
}

module.exports = SearchService;
