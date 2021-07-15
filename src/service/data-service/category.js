class CategoryService {
  constructor(posts) {
    this._posts = posts;
  }

  getAll() {
    return this._posts.reduce((acc, post) => {
      post.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());
  }
}

module.exports = CategoryService;
