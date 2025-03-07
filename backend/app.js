require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 서빙
app.use(cors());
app.use(express.json());  // JSON 파싱을 위한 미들웨어 추가
connectDB();

app.use("/", require("./routes/main")); // 메인 라우터 추가
app.use("/", require("./routes/login")); // 로그인 라우터 추가
app.use("/", require("./routes/register")); // 회원가입 라우터 추가
app.use("/search", require("./routes/search")); // 검색 라우터 추가
app.use("/ai", require("./routes/ai")); // 자소서 생성 라우터 추가
app.use("/community", require("./routes/community")); // 커뮤니티 라우터 추가
app.use("/list", require("./routes/list")); // 리스트 라우터 추가
app.use("/mypage", require("./routes/my_page")); // 마이페이지 라우터 추가

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});