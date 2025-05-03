import express from 'express';
import { register, login } from '../controller/user.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
export default router;
