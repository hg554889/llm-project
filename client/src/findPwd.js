import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './findPwd.css'; // CSS 파일 추가

const FindPwd = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [username, setUsername] = useState("");
    const [activeTab, setActiveTab] = useState('findPwd'); // 탭 상태 관리
  
    // API 호출 (처음 1번 실행)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/message');
          setMessage(response.data.message);
        } catch (error) {
          console.error('API 호출 오류:', error);
          setMessage('API 호출 실패');
        }
      };

      fetchData();
    }, []);

      // 사이드바 열기/닫기 함수
    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Find Pwd with", username);
  };

  return (
    <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <h2>History</h2>
            <ul>
            </ul>
        </div>
        
      <div className="header">
        <div className="left-section">
          <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
          <img src={mainlogo} alt="logo" />
          <h1>CPR</h1>
        </div>

        <h1 onClick={() => navigate('/')}>Code Programming Runner</h1>

        <div className="right-section">
          <i className="fa-solid fa-user-plus" onClick={() => navigate('/login')}></i>
          <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
        </div>
      </div>

      <div className="findInfo-container">
        <div className="findInfo-box">
          <h2>Find Your ID / Password</h2>

          {/* 🔹 탭 버튼 */}
          <div className="find-tabs">
            <button
              className={activeTab === 'findId' ? 'active' : ''}
              onClick={() => {setActiveTab('findId'); navigate('/findId'); }}>
              Find E-Mail
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
