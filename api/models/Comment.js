import { DataTypes } from 'sequelize';
import { sequelize } from '../database/configpostgre.js';

const Comment = sequelize.define('Comment', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  commenterName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'comments',
  timestamps: true,
});

export default Comment;
