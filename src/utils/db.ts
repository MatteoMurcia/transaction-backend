import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST! : process.env.MONGO_URI!;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected to ${process.env.NODE_ENV === 'test' ? 'test' : 'development'} database`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};
