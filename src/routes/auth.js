import express from 'express';
import { loginForm, loginPost, logout } from '../controllers/authController.js';
const router = express.Router();

router.get('/login', loginForm);
router.post('/login', loginPost);
router.get('/logout', logout);

export default router;
