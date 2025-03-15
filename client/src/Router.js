import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Main.js';  // 메인 페이지
import Login from './login.js';      // 로그인 페이지
import SignIn from './signIn.js';    // 회원가입 페이지
import UserPage from './user.js';    // 유저 페이지
import EnvirPage from './envir.js';  // 환경 설정 페이지

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/envir" element={<EnvirPage />} />
    </Routes>
  );
}

export default Router;
