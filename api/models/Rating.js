import { DataTypes } from 'sequelize';
import { sequelize } from '../database/configpostgre.js';

const Rating = sequelize.define('Rating', {
  artisanName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'ratings',
  timestamps: true,
});

export default Rating;
