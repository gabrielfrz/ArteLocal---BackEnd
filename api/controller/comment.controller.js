import Comment from '../models/Comment.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// POST /comments - Adicionar novo comentário
export const addComment = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { productId, text } = req.body;
    if (!text || !productId) {
      return res.status(400).json({ message: 'Produto e texto são obrigatórios.' });
    }

    const newComment = await Comment.create({
      productId,
      author: user.name,
      content: text
    });

    return res.status(201).json({
      id: newComment.id,
      productId: newComment.productId,
      author: newComment.author,
      content: newComment.content,
      createdAt: newComment.createdAt
    });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
};

// GET /comments/:productId - Listar comentários de um produto
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']]
    });

    const formattedComments = comments.map((c) => ({
      id: c.id,
      author: c.author,
      content: c.content,
      createdAt: c.createdAt
    }));

    return res.status(200).json(formattedComments);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return res.status(500).json({ message: 'Erro ao buscar comentários' });
  }
};
