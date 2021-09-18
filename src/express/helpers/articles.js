const dayjs = require(`dayjs`);

const modifiedArticle = (article) => {
  article.date = dayjs(article.createdDate).format(`YYYY-MM-DDTHH:mm`);
  article.outputDate = dayjs(article.createdDate).format(`DD.MM.YYYY, HH:mm`);

  return article;
};

module.exports = {
  modifiedArticle
};
