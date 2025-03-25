import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import "./MyPage.css"; // CSS 분리

const Mypage = () => {
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    // 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
       
    });


    return (
         <div className="container">
        
        
                <div className="header">
                  <div className='left-section'>
                  <i className="fa-sharp fa-solid fa-bars"></i>
                   <img src={mainlogo} alt='logo' />
                  <h1 >CPR</h1>
                  </div>
        
                  <h1 onClick={() => navigate('')}>Code Programming Runner</h1> {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                
                  <div className='right-section'>
                  <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                  {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                  <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                  </div>
                </div>
          
                <div className="mypage-container">
    {/* 왼쪽 프로필 카드 */}
  <div className="profile-card">
    <div className="profile-circle" />
    <div className="profile-info"></div>
    <p className="profile-name">Aurora &gt;</p>
    <p className="profile-email">gudeg0702@gmail.com</p>

    <ul className="profile-menu">
      <li onClick={() => navigate('/myPage')}>My Page</li>
      <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
      <li onClick={() => navigate('/savedLink')}>Saved Links</li>
      <li>Note</li>
      <textarea className="profile-note" placeholder="Write a note..." />
      <li onClick={() => navigate('/')}>Log out</li>
    </ul>
    
  </div>

  {/* 오른쪽 정보 카드 */}
  <div className="info-card">
    <p><strong>ID</strong><br />Aurora</p>
    <p><strong>E-Mail</strong><br />gudeg0702@gmail.com</p>
    <p><strong>Password</strong><br />_</p>
    <p><strong>My interests</strong><br />
      <span className="tag">#Python</span>
      <span className="tag">#C/C++</span>
      <span className="tag">#Algorithm</span>
    </p>
  </div>
</div>
        </div>
    );
};

export default Mypage;
