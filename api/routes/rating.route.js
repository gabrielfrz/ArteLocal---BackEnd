import express from 'express';
import { addRating, getAverageRating, hasUserRatedArtisan } from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

// POST: Adicionar nova avaliação
router.post('/', verifyToken, addRating);

// GET: Verificar se o usuário já avaliou o artesão (deve vir antes da rota dinâmica)
router.get('/check/:artisanName', verifyToken, hasUserRatedArtisan);

// GET: Obter média de avaliações de um artesão
router.get('/:artisanName', getAverageRating);

export default router;
