const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Comment extends Model {}

  Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  });

  return Comment;
};
