import { DataTypes } from 'sequelize';
import { sequelize } from '../database/configpostgre.js';

const Comment = sequelize.define('Comment', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

export default Comment;
