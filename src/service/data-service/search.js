class SearchService {
  constructor(posts) {
    this._posts = posts;
  }

  getAll(searchText) {
    return this._posts
      .filter((post) => post.title.includes(searchText));
  }
}

module.exports = SearchService;
