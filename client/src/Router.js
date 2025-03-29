import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Main.js';  // 메인 페이지
import Login from './login.js';      // 로그인 페이지
import SignIn from './signIn.js';    // 회원가입 페이지
import FindId from './findId.js';    // 아이디 찾기 페이지
import FindPwd from './findPwd.js';    // 비밀번호 찾기 페이지
import LoginTemp from './login_temp.js';    // 로그인 템플릿 페이지
import UserMainPage from './UserMain.js';  // 유저 메인 페이지


import MyPage from './MyPage.js';    // 마이 페이지(로그인 되면 아이콘 바뀌는데)
import SavedQ from'./SavedQuestion.js' //저장된 질문 페이지
import SavedLink from './SavedLink.js' //저장된 링크 페이지
import NotePage from './NoteP.js';  // 진짜 노트 페이지

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/findId" element={<FindId />} />
      <Route path="/findPwd" element={<FindPwd />} />
      <Route path="/loginTemp" element={<LoginTemp />} />
      <Route path="/userMain" element={<UserMainPage />} />
      <Route path="/myPage" element={<MyPage />} />
      <Route path="/savedQ" element={<SavedQ />} />
      <Route path="/savedLink" element={<SavedLink />} />
      <Route path="/noteP" element={<NotePage />} />
    </Routes>
  );
}

export default Router;
