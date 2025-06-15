import express from 'express';
import { create, list, listByUser, deleteProduct } from '../controller/product.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, list);
router.get('/my', verifyToken, listByUser);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
