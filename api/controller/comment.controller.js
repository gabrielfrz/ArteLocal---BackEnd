import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const { productId, commenterName, text } = req.body;
    const newComment = await Comment.create({ productId, commenterName, text });
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
};

export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.findAll({ where: { productId }, order: [['createdAt', 'DESC']] });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar comentários' });
  }
};
