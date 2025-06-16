import express from 'express';
import { addComment, getCommentsByProduct, deleteComment } from '../controller/comment.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addComment);
router.get('/:productId', getCommentsByProduct);
router.delete('/:id', verifyToken, deleteComment);

export default router;
