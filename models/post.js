const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  classMethods: {
    associate: function (models) {
      models.Post.belongsTo(models.Category, { constraints: false })
    }
  }
})

Post.associate = function (models) {
  Post.hasOne(models.Vote,
    {
      foreignKey: 'post_id',
      constraints: false
    }
  )
}

Post.sync()

module.exports = Post
