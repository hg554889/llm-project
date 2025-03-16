import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Main.js';  // 메인 페이지
import Login from './login.js';      // 로그인 페이지
import SignIn from './signIn.js';    // 회원가입 페이지
import FindInfo from './findInfo.js';  // 정보 찾기 페이지
import EnvirPage from './envir.js';  // 환경 설정 페이지
import UserMainPage from './UserMain.js';  // 유저 메인 페이지
import MyPage from './MyPage.js';    // 마이 페이지(로그인 되면 아이콘 바뀌는데데)

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/findInfo" element={<FindInfo />} />
      <Route path="/envir" element={<EnvirPage />} />
      <Route path="/userMain" element={<UserMainPage />} />
      <Route path="/myPage" element={<MyPage />} />
    </Routes>
  );
}

export default Router;
