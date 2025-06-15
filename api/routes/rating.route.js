import express from 'express';
import { addRating, getAverageRating } from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addRating);
router.get('/:artisanName', getAverageRating);

export default router;
