import express from 'express';
import { newSubForm, newSubPost, markPaid } from '../controllers/subscriptionController.js';
const router = express.Router();

router.get('/new/:memberId?', newSubForm);
router.post('/new', newSubPost);
router.get('/:id/paid', markPaid);

export default router;
