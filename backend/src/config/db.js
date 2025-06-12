const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://programmerumair29:UWscPCqj2zs5pw8E@cluster0.lkipgdk.mongodb.net/portfolio?retryWrites=true&w=majority', {
      // Removed deprecated options
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds for debugging
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;