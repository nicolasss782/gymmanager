import express from 'express';
import { dashboard } from '../controllers/dashboardController.js';
import { ensureAuth } from '../middleware/auth.js';
const router = express.Router();

router.get('/', ensureAuth, dashboard);

export default router;
