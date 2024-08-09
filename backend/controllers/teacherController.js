import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

export const createTeacher = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User({
            email,
            password,
            role: 'Teacher',
        });

        await newUser.save();
        res.status(201).json({ message: 'Teacher created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'Teacher' });
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTeacher = async (req, res) => {
    const { teacherId, email, password } = req.body;

    try {
        const updatedTeacher = await User.findByIdAndUpdate(
            teacherId,
            { email, password },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher updated successfully', user: updatedTeacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTeacher = async (req, res) => {
    const { teacherId } = req.params;

    try {
        const deletedTeacher = await User.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getStudentsInClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ teacher: req.user.id }).populate('students');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json(classroom.students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in getting students');
  }
};

export const updateStudent = async (req, res) => {
  const { studentId, email } = req.body;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.email = email || student.email;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in updating student');
  }
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findByIdAndDelete(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in deleting student');
  }
};
