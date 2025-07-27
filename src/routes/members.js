import express from 'express';
import { ensureAuth } from '../middleware/auth.js';
import {
  listMembers, memberDetail,
  newMemberForm, newMemberPost,
  editMemberForm, editMemberPost,
  deleteMember
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', ensureAuth, listMembers);
router.get('/new', ensureAuth, newMemberForm);
router.post('/new', ensureAuth, newMemberPost);
router.get('/:id', ensureAuth, memberDetail);
router.get('/:id/edit', ensureAuth, editMemberForm);
router.post('/:id/edit', ensureAuth, editMemberPost);
router.post('/:id/delete', ensureAuth, deleteMember);

export default router;
