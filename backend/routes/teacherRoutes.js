import express from 'express';
import { 
    getStudentsInClassroom, 
    updateStudent, 
    deleteStudent,
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    getAllStudents
} from '../controllers/teacherController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// student routes
router.get('/students', protect(['Teacher']), getStudentsInClassroom);
router.put('/update-student', protect(['Principal', 'Teacher']), updateStudent);
router.delete('/delete-student/:studentId', protect(['Principal', 'Teacher']), deleteStudent);

// principal routes
router.post('/create-teacher', protect(['Principal']), createTeacher);
router.get('/all', protect(['Principal']), getTeachers);
router.put('/update-teacher', protect(['Principal']), updateTeacher);
router.delete('/delete-teacher/:teacherId', protect(['Principal']), deleteTeacher);

// get all students in db
router.get('/students/all', protect(['Principal', 'Teacher']), getAllStudents);


export default router;
