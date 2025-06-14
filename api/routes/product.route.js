import express from 'express';
import { create, list } from '../controller/product.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();


router.post('/', verifyToken, create);

// Rota para listar produtos (acessível a qualquer usuário logado)
router.get('/', verifyToken, list);

export default router;
