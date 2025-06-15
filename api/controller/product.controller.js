import Product from '../models/Product.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

// POST /products - Criar novo produto
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

// GET /products - Área do Cliente - Listar todos com filtro de preço, email e avaliação média
export const list = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const whereClause = {};
    if (minPrice) whereClause.price = { [Op.gte]: minPrice };
    if (maxPrice) {
      whereClause.price = whereClause.price
        ? { ...whereClause.price, [Op.lte]: maxPrice }
        : { [Op.lte]: maxPrice };
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const productsWithDetails = await Promise.all(products.map(async (product) => {
      const user = await User.findOne({ where: { name: product.artistName } });

      const ratings = await Rating.findAll({ where: { artisanName: product.artistName } });
      const averageRating = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
        : 'Sem avaliações';

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        contact: product.contact.replace(/\D/g, ''),  // Limpa telefone
        artistName: product.artistName,
        artistEmail: user ? user.email : 'Email não encontrado',
        averageRating,
        image: product.image,
        createdAt: product.createdAt
      };
    }));

    return res.status(200).json(productsWithDetails);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /products/my - Listar apenas os produtos do usuário logado (artesão)
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
