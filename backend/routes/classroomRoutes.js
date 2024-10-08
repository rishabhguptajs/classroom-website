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
  getStudentsClassrooms,
  updateClassroom,
} from '../controllers/classroomController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', protect(['Principal', 'Teacher']), createClassroom);
router.post('/update', protect(['Principal', 'Teacher']), updateClassroom);
router.post('/assign-student', protect(['Principal', 'Teacher']), assignStudentToClassroom);
router.post('/assign-teacher', assignTeacherToClassroom);
router.get('/all', getAllClassrooms);
router.get('/users', protect(['Principal']), getTeachersAndStudents);
router.put('/update-user', protect(['Principal']), updateUser);
router.delete('/delete-user/:id', protect(['Principal']), deleteUser);
router.get('/getclass/:teacherId', protect(['Teacher']), getTeachersClassrooms);
router.get('/student-class/:studentId', protect(['Student']), getStudentsClassrooms);

export default router;