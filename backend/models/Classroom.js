import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sessions: {
    type: [sessionSchema],
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;
