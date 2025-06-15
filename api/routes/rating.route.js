import express from 'express';
import { addRating, getAverageRating, hasUserRatedArtisan } from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addRating);

// Coloque a rota /check antes da /:artisanName
router.get('/check/:artisanName', verifyToken, hasUserRatedArtisan);
router.get('/:artisanName', getAverageRating);

export default router;
