require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { HfInference } = require('@huggingface/inference');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 서빙
app.use(cors());
app.use(express.json());  // JSON 파싱을 위한 미들웨어 추가
connectDB();

const hf = new HfInference(process.env.HF_API_KEY);

app.use("/", require("./routes/main"));
app.use("/auth", require("./routes/login")); // 로그인 라우터 추가

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});