import Rating from '../models/Rating.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// POST /ratings - Adicionar nova avaliação
export const addRating = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { artisanName, score } = req.body;
    const numericScore = Number(score);

    if (!artisanName || isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
      return res.status(400).json({ message: 'Nome do artesão e nota entre 1 e 5 são obrigatórios.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const existing = await Rating.findOne({ where: { artisanName, userId } });
    if (existing) {
      return res.status(400).json({ message: 'Você já avaliou este artesão.' });
    }

    const newRating = await Rating.create({
      artisanName,
      score: numericScore,
      userId
    });

    return res.status(201).json(newRating);
  } catch (error) {
    console.error('Erro ao adicionar avaliação:', error);
    return res.status(500).json({ message: 'Erro ao adicionar avaliação.' });
  }
};

// GET /ratings/:artisanName - Calcular média de avaliações
export const getAverageRating = async (req, res) => {
  try {
    const { artisanName } = req.params;

    const ratings = await Rating.findAll({ where: { artisanName } });
    const validRatings = ratings.filter(r => typeof r.score === 'number' && !isNaN(r.score));

    if (validRatings.length === 0) {
      return res.status(200).json({ average: 'Sem avaliações' });
    }

    const total = validRatings.reduce((sum, r) => sum + r.score, 0);
    const average = total / validRatings.length;

    return res.status(200).json({ average: average.toFixed(1) });
  } catch (error) {
    console.error('Erro ao calcular média de avaliações:', error);
    return res.status(500).json({ message: 'Erro ao calcular média de avaliações.' });
  }
};

// GET /ratings/check/:artisanName - Verificar se usuário já avaliou o artesão
export const hasUserRatedArtisan = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { artisanName } = req.params;

    const existingRating = await Rating.findOne({
      where: {
        artisanName,
        userId
      }
    });

    return res.status(200).json({ alreadyRated: !!existingRating });
  } catch (error) {
    console.error('Erro ao verificar se usuário já avaliou:', error);
    return res.status(500).json({ message: 'Erro ao verificar avaliação.' });
  }
};
