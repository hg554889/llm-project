require("dotenv").config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use("/", require("./routes/main"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});