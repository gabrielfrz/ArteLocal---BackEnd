import Comment from '../models/Comment.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// POST /comments - Adicionar novo comentário
export const addComment = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const { productId, text } = req.body;
    if (!text || !productId) {
      return res.status(400).json({ message: 'Produto e texto são obrigatórios.' });
    }

    const newComment = await Comment.create({
      productId,
      author: user.name,
      content: text
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({ message: 'Erro ao adicionar comentário.' });
  }
};

// GET /comments/:productId - Buscar comentários de um produto
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return res.status(500).json({ message: 'Erro ao buscar comentários.' });
  }
};

// DELETE /comments/:id - Excluir comentário (somente autor pode)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Comentário não encontrado.' });

    if (comment.author !== user.name) {
      return res.status(403).json({ message: 'Você só pode excluir seus próprios comentários.' });
    }

    await comment.destroy();
    return res.status(200).json({ message: 'Comentário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    return res.status(500).json({ message: 'Erro ao excluir comentário.' });
  }
};
