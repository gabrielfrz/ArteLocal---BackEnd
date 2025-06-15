import Product from '../models/Product.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
      image: newProduct.image,
      createdAt: newProduct.createdAt
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /products - Listar todos (usado na área do cliente)
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
      image: product.image,
      createdAt: product.createdAt
    }));

    return res.status(200).json(productsFormatted);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /products/my - Listar apenas os produtos do usuário logado
export const listByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const userProducts = await Product.findAll({
      where: { artistName: user.name },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(userProducts);
  } catch (error) {
    console.error('Error fetching user products:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
