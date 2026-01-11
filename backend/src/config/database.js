const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3s instead of 30s
      socketTimeoutMS: 5000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Error: ${error.message}`);
    console.warn('⚠ Running without database connection. Using mock data.');
    // Don't exit - allow server to run without DB for development
  }
};

module.exports = connectDB;
