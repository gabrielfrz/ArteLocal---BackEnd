import express from 'express';
import { create, list } from '../controller/product.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

// POST /products
router.post('/', verifyToken, create);

// GET /products
router.get('/', verifyToken, list);

export default router;
