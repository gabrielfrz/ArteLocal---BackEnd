import express from 'express';
import { addComment, getCommentsByProduct } from '../controller/comment.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addComment);
router.get('/:productId', getCommentsByProduct);

export default router;
