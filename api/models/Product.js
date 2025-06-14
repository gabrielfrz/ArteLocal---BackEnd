import { DataTypes } from 'sequelize';
import { sequelize } from '../database/configpostgre.js';

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true
});

export default Product;
