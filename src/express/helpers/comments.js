const commentsList = (articles) => articles.reduce((acc, article) => {
  article.comments.forEach((comment) => {
    acc.push({
      ...comment,
      articleId: article.id,
      articleTitle: article.title
    });
  });
  return acc;
}, []);

module.exports = {
  commentsList
};
