import { DataTypes } from 'sequelize';
import { sequelize } from '../database/configpostgre.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('client', 'artisan'),
    allowNull: false,
    defaultValue: 'client'
  }
}, {
  tableName: 'users',
  timestamps: true
});

export default User;
