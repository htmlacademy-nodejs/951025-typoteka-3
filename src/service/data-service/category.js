const Aliase = require(`../models/aliase`);
const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategories = sequelize.models.ArticleCategories;
  }

  async findAll(needCount) {
    if (needCount) {
      const countedCategories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,

          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],

        group: [Sequelize.col(`Category.id`)],

        include: [{
          model: this._ArticleCategories,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }],
      });

      return countedCategories.map((category) => category.get());
    }

    return await this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
