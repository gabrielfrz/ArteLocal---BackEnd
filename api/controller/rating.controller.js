import Rating from '../models/Rating.js';
import { Op } from 'sequelize';

export const addRating = async (req, res) => {
  try {
    const { artisanName, score } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Nota deve ser entre 1 e 5 estrelas.' });
    }

    const newRating = await Rating.create({ artisanName, score });
    return res.status(201).json(newRating);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao adicionar avaliação' });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { artisanName } = req.params;
    const ratings = await Rating.findAll({ where: { artisanName } });

    if (!ratings.length) {
      return res.status(200).json({ average: 'Sem avaliações' });
    }

    const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
    return res.status(200).json({ average: average.toFixed(1) });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar média de avaliações' });
  }
};
