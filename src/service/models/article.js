const {Model, DataTypes} = require(`sequelize`);

class Article extends Model {}

module.exports = (sequelize) => {
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: DataTypes.STRING,
    fullText: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    announcement: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`,
  });

  return Article;
};
