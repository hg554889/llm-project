import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './findPwd.css'; // CSS 파일 추가

const FindPwd = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [username, setUsername] = useState("");
    const [activeTab, setActiveTab] = useState('findPwd'); // 탭 상태 관리

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Find Pwd with", username);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="left-section">
          <img src={mainlogo} alt="logo" />
          <h1>CPR</h1>
        </div>

        <h1 onClick={() => navigate('/')}>Code Programming Runner</h1>

        <div className="right-section">
          <i className="fa-solid fa-user-plus" onClick={() => navigate('/login')}></i>
          <i className="fa-solid fa-layer-group" ></i>
        </div>
      </div>

      <div className="findInfo-container">
        <div className="findInfo-box">
          <h2>Find User Name / Password</h2>

          {/* 🔹 탭 버튼 */}
          <div className="find-tabs">
            <button
              className={activeTab === 'findId' ? 'active' : ''}
              onClick={() => {setActiveTab('findId'); navigate('/findId'); }}>
              Find User Name / E-Mail
            </button>
            <button
              className={activeTab === 'findPwd' ? 'active' : ''}
              onClick={() => { setActiveTab('findPwd'); navigate('/findPwd'); }}>
              Find Password
            </button>
          </div>

          {/* 🔹 입력 필드 */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* 🔹 Continue 버튼 -> 안내창 */}
            <button type="submit" className="continue-btn" onClick={() => navigate('/loginTemp')}>
              Continue
            </button>
          </form>

          {/* 🔹 회원가입 페이지 이동 */}
          <a
            href="/signIn"
            className="register-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/signIn');
            }}
          >
            Create Your Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default FindPwd;
