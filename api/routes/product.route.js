import express from 'express';
import { create, list } from '../controller/product.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// POST /products - criar novo produto com upload de imagem
router.post('/', verifyToken, upload.single('image'), create);

// GET /products - listar todos os produtos (apenas usuários logados)
router.get('/', verifyToken, list);

export default router;
