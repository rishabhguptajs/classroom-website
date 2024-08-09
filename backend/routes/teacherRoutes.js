import express from 'express';
import { 
    getStudentsInClassroom, 
    updateStudent, 
    deleteStudent,
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacherController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// student routes
router.get('/students', protect(['Teacher']), getStudentsInClassroom);
router.put('/update-student', protect(['Teacher']), updateStudent);
router.delete('/delete-student/:studentId', protect(['Teacher']), deleteStudent);

// teacher routes
router.post('/create-teacher', protect(['Principal']), createTeacher);
router.get('/teachers', protect(['Principal']), getTeachers);
router.put('/update-teacher', protect(['Principal']), updateTeacher);
router.delete('/delete-teacher/:teacherId', protect(['Principal']), deleteTeacher);

export default router;
