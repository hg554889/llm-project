require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
connectDB();

app.use("/", require("./routes/main"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});