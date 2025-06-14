import express from 'express';
import { create, list, listByUser } from '../controller/product.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

// POST /products - Cadastrar produto
router.post('/', verifyToken, create);

// GET /products - Listar todos os produtos
router.get('/', verifyToken, list);

// GET /products/my - Listar apenas os produtos do usuário logado (artesão)
router.get('/my', verifyToken, listByUser);

export default router;
