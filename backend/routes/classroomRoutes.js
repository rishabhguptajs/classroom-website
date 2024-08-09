import express from 'express';
import {
  createClassroom,
  assignStudentToClassroom,
  getTeachersAndStudents,
  updateUser,
  deleteUser,
} from '../controllers/classroomController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', protect(['Principal']), createClassroom);
router.post('/assign-student', protect(['Principal', 'Teacher']), assignStudentToClassroom);
router.get('/users', protect(['Principal']), getTeachersAndStudents);
router.put('/update-user', protect(['Principal']), updateUser);
router.delete('/delete-user/:id', protect(['Principal']), deleteUser);

export default router;
