import express from 'express';
import { createStudent, getClassmates } from '../controllers/studentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/classmates', protect(['Student']), getClassmates);
router.post('/create-student', protect(['Principal', 'Teacher']), createStudent);

export default router;
