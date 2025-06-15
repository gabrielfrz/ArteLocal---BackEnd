import express from 'express';
import { addRating, getAverageRating, hasUserRatedArtisan } from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addRating);
router.get('/:artisanName', getAverageRating);
router.get('/check/:artisanName', verifyToken, hasUserRatedArtisan);  // <-- Nova rota

export default router;
