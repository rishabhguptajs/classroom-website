import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

export const createClassroom = async (req, res) => {
    const { name, sessions } = req.body;
    const teacherId = req.user.id;

    try {
        const teacher = await User.findById(teacherId);
        if (!teacher || (teacher.role !== 'Teacher' && teacher.role !== 'Principal')) {
            return res.status(400).json({
                message: 'Invalid teacher ID',
                user: teacher,
            });
        }

        const classroom = new Classroom({
            name,
            sessions,
            teacher: teacherId,
        });

        await classroom.save();

        res.status(201).json(classroom);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateClassroom = async (req, res) => {
    const { classroomId, sessions } = req.body;

    if (!classroomId || !sessions) {
        return res.status(400).json({ message: "Invalid request parameters." });
    }

    try {
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        classroom.sessions = sessions;
        await classroom.save();

        res.status(200).json({ message: "Classroom sessions updated successfully." });
    } catch (error) {
        console.error("Error updating classroom:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
export const assignStudentToClassroom = async (req, res) => {
    const { classroomId, studentId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== 'Student') {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        if (classroom.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student already assigned to classroom' });
        }

        classroom.students.push(studentId);
        await classroom.save();

        res.json(classroom);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in assigning student to classroom');
    }
};

export const getTeachersAndStudents = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'Teacher' });
        const students = await User.find({ role: 'Student' });

        res.json({ teachers, students });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateUser = async (req, res) => {
    const { id, email, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in updating user');
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in deleting user');
    }
};

export const assignTeacherToClassroom = async (req, res) => {
    const { classroomId, teacherId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'Teacher') {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }

        const existingClassroom = await Classroom.findOne({ teacher: teacherId });

        if (existingClassroom) {
            return res.status(400).json({ message: 'Teacher already assigned to a classroom' });
        }

        classroom.teacher = teacherId;
        await classroom.save();

        res.json(classroom);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in assigning teacher to classroom');
    }
};

export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find();

        const teacherIds = [...new Set(classrooms.map(classroom => classroom.teacher))];

        const teachers = await User.find({ _id: { $in: teacherIds } });

        const teacherMap = teachers.reduce((acc, teacher) => {
            acc[teacher._id] = teacher.email;
            return acc;
        }, {});

        const classroomsWithTeacherNames = classrooms.map(classroom => ({
            ...classroom._doc,
            teacher: teacherMap[classroom.teacher] || "Unknown"
        }));

        res.json(classroomsWithTeacherNames);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export const getTeachersClassrooms = async (req, res) => {
    const teacherId = req.params.teacherId;

    try {
        const classrooms = await Classroom.find({ teacher: teacherId });
        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in fetching classrooms');
    }
}

export const getStudentsClassrooms = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const classrooms = await Classroom.find({ students: studentId })
            .populate('teacher', 'email')
            .populate('students', 'name email');

        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in fetching classrooms');
    }
};
