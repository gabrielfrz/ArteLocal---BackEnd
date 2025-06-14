import Product from '../models/Product.js';
import { Op } from 'sequelize';

// POST /products
export const create = async (req, res) => {
  try {
    const { title, description, price, image, contact, artistName } = req.body;

    if (!title || !description || !price || !image || !contact || !artistName) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      image, 
      contact,
      artistName
    });

    return res.status(201).json({
      id: newProduct.id,
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      contact: newProduct.contact,
      artistName: newProduct.artistName,
      imageUrl: newProduct.image,
      createdAt: newProduct.createdAt
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /products
export const list = async (req, res) => {
  try {
    const { maxPrice } = req.query;

    const whereClause = maxPrice
      ? { price: { [Op.lte]: maxPrice } }
      : {};

    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const productsFormatted = products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      contact: product.contact,
      artistName: product.artistName,
      imageUrl: product.image, // Também retornando o campo texto
      createdAt: product.createdAt
    }));

    return res.status(200).json(productsFormatted);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
