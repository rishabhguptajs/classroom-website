import mongoose from "mongoose";
import bcrpyt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Principal', 'Teacher', 'Student'],
      required: true,
      default: 'Student',
    },
  });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrpyt.genSalt(10);
    this.password = await bcrpyt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;