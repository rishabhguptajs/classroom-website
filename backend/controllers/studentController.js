import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

export const getClassmates = async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ students: req.user.id }).populate('students');
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.json(classroom.students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const createStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingStudent = await User.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const student = new User({
            email,
            password,
            role: 'Student'
        });

        await student.save();

        res.status(201).json(student);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error in creating student',
            error: error.message
        });
    }
}
export const getDetails = async (req, res) => {
    try {
        const { studentIds } = req.body;

        const users = await User.find({ _id: { $in: studentIds } });

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in fetching user details');
    }
}
