import express from 'express';
import {
  createClassroom,
  assignStudentToClassroom,
  getTeachersAndStudents,
  updateUser,
  deleteUser,
  assignTeacherToClassroom,
  getAllClassrooms,
  getTeachersClassrooms,
} from '../controllers/classroomController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', protect(['Principal', 'Teacher']), createClassroom);
router.post('/assign-student', protect(['Principal', 'Teacher']), assignStudentToClassroom);
router.post('/assign-teacher', assignTeacherToClassroom);
router.get('/all', getAllClassrooms);
router.get('/users', protect(['Principal']), getTeachersAndStudents);
router.put('/update-user', protect(['Principal']), updateUser);
router.delete('/delete-user/:id', protect(['Principal']), deleteUser);
router.get('/getclass/:teacherId', protect(['Teacher']), getTeachersClassrooms);

export default router;