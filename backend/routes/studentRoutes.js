import express from 'express';
import { createStudent, getClassmates, getDetails } from '../controllers/studentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/classmates', protect(['Student']), getClassmates);
router.post('/create-student', protect(['Principal', 'Teacher']), createStudent);
router.post('/getdetails', protect(['Principal', 'Teacher', 'Student']), getDetails);

export default router;
