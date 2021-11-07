const Aliase = require(`./aliase`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const {Model} = require(`sequelize`);

module.exports = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`, onDelete: `cascade`});
  Article.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`, onDelete: `cascade`});
  Comment.belongsTo(User, {foreignKey: `userId`});

  class ArticleCategories extends Model {}
  ArticleCategories.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategories, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategories, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategories, {as: Aliase.ARTICLE_CATEGORIES});
  Article.hasMany(ArticleCategories, {as: Aliase.ARTICLE_CATEGORIES});

  return {ArticleCategories, Article, Category, Comment, User};
};
