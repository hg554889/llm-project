import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './findId.css'; // CSS 파일 추가

const FindId = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [email, setEmail] = useState("");
    const [activeTab, setActiveTab] = useState('findId'); // 탭 상태 관리
    const [showPopup, setShowPopup] = useState(false); // ✅ 팝업 상태 관리
    const [userId, MyUserId] = useState(''); // ✅ 사용자 ID 저장

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
    const mockUserId = "User123"; 
    MyUserId(mockUserId);
    
    // 🔹 팝업을 띄우기
    setShowPopup(true);
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
              placeholder="E-Mail (ID@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* 🔹 Continue 버튼 -> 안내창 */}
            <button type="submit" className="continue-btn">
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

            {/* ✅ 팝업 창 추가 */}
            {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close-btn" onClick={() => setShowPopup(false)}>×</span>
            </div>
            <p>Your ID = "<strong>{userId}</strong>"</p>
            <button onClick={() => navigate('/login')}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindId;
