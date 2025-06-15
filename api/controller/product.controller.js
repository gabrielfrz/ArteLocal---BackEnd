import Product from '../models/Product.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import Comment from '../models/Comment.js';
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

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error.message);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// GET /products - Listar produtos (cliente)
export const list = async (req, res) => {
  try {
    const { minPrice, maxPrice, order = 'asc' } = req.query;

    const whereClause = {};
    if (minPrice) whereClause.price = { [Op.gte]: minPrice };
    if (maxPrice) {
      whereClause.price = whereClause.price
        ? { ...whereClause.price, [Op.lte]: maxPrice }
        : { [Op.lte]: maxPrice };
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['price', order.toLowerCase() === 'desc' ? 'DESC' : 'ASC']]
    });

    const productsWithDetails = await Promise.all(products.map(async (product) => {
      try {
        const user = await User.findOne({ where: { name: product.artistName } });

        const ratings = await Rating.findAll({ where: { artisanName: product.artistName } });
        const averageRating = ratings.length
          ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
          : 'Sem avaliações';

        const comments = await Comment.findAll({
          where: { productId: product.id },
          order: [['createdAt', 'DESC']]
        });

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          contact: product.contact.replace(/\D/g, ''),
          artistName: product.artistName,
          artistEmail: user ? user.email : 'Email não disponível',
          averageRating,
          comments,
          image: product.image,
          createdAt: product.createdAt
        };
      } catch (err) {
        console.error(`Erro ao carregar detalhes do produto ${product.id}:`, err.message);
      
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          contact: product.contact,
          artistName: product.artistName,
          artistEmail: 'Erro ao buscar email',
          averageRating: 'Erro ao calcular',
          comments: [],
          image: product.image,
          createdAt: product.createdAt
        };
      }
    }));

    return res.status(200).json(productsWithDetails);
  } catch (error) {
    console.error('Erro ao listar produtos:', error.message);
    return res.status(500).json({ message: 'Erro interno ao listar produtos' });
  }
};

// GET /products/my - Listar produtos do artesão logado
export const listByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const userProducts = await Product.findAll({
      where: { artistName: user.name },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(userProducts);
  } catch (error) {
    console.error('Erro ao listar produtos do usuário:', error.message);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// DELETE /products/:id - Excluir obra (apenas o dono pode excluir)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    if (product.artistName !== user.name) {
      return res.status(403).json({ message: 'Você só pode excluir suas próprias obras.' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error.message);
    return res.status(500).json({ message: 'Erro interno ao excluir produto.' });
  }
};
