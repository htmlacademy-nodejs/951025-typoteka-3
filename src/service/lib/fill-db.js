const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const {ExitCode} = require(`../../const`);
const {logger} = require(`../lib/logger`);

module.exports = async (sequelize, {articles, categories, users}) => {
  try {
    logger.info(`Trying to fill database...`);
    const {Article, Category, User} = defineModels(sequelize);
    await sequelize.sync({force: true});

    const userPromises = users.map(async (user) => {
      await User.create(user, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});
    });

    const articlesPromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: Aliase.COMMENTS});
      await articleModel.addCategories(article.categories);
    });

    await Category.bulkCreate(categories.map((category) => ({name: category})));
    await Promise.all(userPromises);
    await Promise.all(articlesPromises);

    logger.info(`Database was filled with mock data successfully.`);
  } catch (err) {
    logger.error(`An error occurred on filling database: ${err.message}`);
    process.exit(ExitCode.FAIL);
  }
};
