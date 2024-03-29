import mongoose from 'mongoose';
const mongodb = 'mongodb://localhost:27017/proshop-v2-main'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongodb);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
