const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const connectDB = asyncHandler(async () => {
    // .env 파일에 있는 MONGO_URI를 가져온다.
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
});

module.exports = connectDB;