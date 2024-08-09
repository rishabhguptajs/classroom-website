import mongoose from "mongoose";
import User from "../models/User.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        createDefaultPrincipal();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

const createDefaultPrincipal = async () => {
    try {
        const existingPrincipal = await User.findOne({ role: 'Principal' });
        if (!existingPrincipal) {
            const principal = new User({
                email: 'principal@classroom.com',
                password: 'Admin',
                role: 'Principal'
            });
            await principal.save();
            console.log('Default Principal account created');
        } else {
            console.log('Principal account already exists');
        }
    } catch (error) {
        console.error('Error creating Principal account:', error);
    }
};

export default connectDB;