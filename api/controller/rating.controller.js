import Rating from '../models/Rating.js';

// POST /ratings
export const addRating = async (req, res) => {
  try {
    const { artisanName, score } = req.body;

    const numericScore = Number(score);
    if (!artisanName || isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
      return res.status(400).json({ message: 'Nome do artesão e nota entre 1 e 5 são obrigatórios.' });
    }

    const newRating = await Rating.create({ artisanName, score: numericScore });
    return res.status(201).json(newRating);
  } catch (error) {
    console.error('Erro ao adicionar avaliação:', error);
    return res.status(500).json({ message: 'Erro ao adicionar avaliação' });
  }
};

// GET /ratings/:artisanName
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
    console.error('Erro ao buscar média de avaliações:', error);
    return res.status(500).json({ message: 'Erro ao buscar média de avaliações' });
  }
};
