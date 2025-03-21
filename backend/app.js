require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());  // JSON 파싱을 위한 미들웨어 추가
connectDB();

app.use("/", require("./routes/main")); // 메인 라우터 추가
app.use("/login", require("./routes/login")); // 로그인 라우터 추가
app.use("/register", require("./routes/register")); // 회원가입 라우터 추가
app.use("/ai", require("./routes/ai")); // 자소서 생성 라우터 추가
app.use("/memo", require("./routes/memo")); // 메모 라우터 추가
app.use("/list", require("./routes/list")); // 리스트 라우터 추가
app.use("/mypage", require("./routes/my_page")); // 마이페이지 라우터 추가
app.use("/qna", require("./routes/qna")); // QnA 라우터 추가
app.use("/", require("./routes/findAccount")); // 계정 찾기 라우터 추가
app.use("/findp", require("./routes/findPassword")); // 비밀번호 재설정 라우터 추가

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});