import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import "./MyPage.css"; // CSS 분리

const Mypage = () => {
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState({
      username: '',
      email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [note, setNote] = useState('');

    // 사용자 정보 가져오기
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // 로컬 스토리지에서 로그인한 사용자 이메일 가져오기
          const userEmail = localStorage.getItem('userEmail');
          
          if (!userEmail) {
            // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
            navigate('/login');
            return;
          }
          
          // 이메일로 특정 사용자 정보 요청
          const response = await axios.get(`http://localhost:3001/userMain/${userEmail}`);
          
          if (response.data.success) {
            setUserData(response.data.data);
          } else {
            // 백엔드 API가 아직 구현되지 않은 경우를 위한 임시 처리
            setUserData({ 
              username: userEmail.split('@')[0], // 이메일에서 사용자명 추출
              email: userEmail 
            });
          }
        } catch (err) {
          console.error('사용자 정보 로딩 오류:', err);
          
          // 백엔드 API가 아직 구현되지 않은 경우를 위한 임시 처리
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            setUserData({ 
              username: userEmail.split('@')[0], // 이메일에서 사용자명 추출
              email: userEmail 
            });
          } else {
            setError('사용자 정보를 불러오는 데 실패했습니다.');
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    }, [navigate]);

    // 사이드바 토글 함수
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    // 노트 변경 핸들러
    const handleNoteChange = (e) => {
      setNote(e.target.value);
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
      localStorage.removeItem('userEmail');
      navigate('/');
    };

    return (
         <div className="container">
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                  <h2>History</h2>
                  <ul>
                  </ul>
                </div>
          
                <div className="header">
                  <div className='left-section'>
                  <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
                   <img src={mainlogo} alt='logo' />
                  <h1 >CPR</h1>
                  </div>
        
                  <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1> {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                
                  <div className='right-section'>
                  <i className="fa-solid fa-user" onClick={() => navigate('/myPage')}></i>  
                  {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                  <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                  </div>
                </div>
          
                <div className="mypage-container">
    {/* 왼쪽 프로필 카드 */}
  <div className="profile-card">
    <div className="profile-circle" />
    <div className="profile-info"></div>
    {loading ? (
      <p>로딩 중...</p>
    ) : error ? (
      <p>{error}</p>
    ) : (
      <>
        <p className="profile-name">{userData.username} &gt;</p>
        <p className="profile-email">{userData.email}</p>
      </>
    )}

    <ul className="profile-menu">
      <li onClick={() => navigate('/myPage')}>My Page</li>
      <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
      <li onClick={() => navigate('/savedLink')}>Saved Links</li>
      <li onClick={() => navigate('/note')}>Note</li>
      <textarea 
        className="profile-note" 
        placeholder="Write a note..." 
        value={note}
        onChange={handleNoteChange}
      />
      <li onClick={handleLogout}>Log out</li>
    </ul>
    
  </div>

  {/* 오른쪽 정보 카드 */}
  <div className="info-card">
    {loading ? (
      <p>사용자 정보를 불러오는 중...</p>
    ) : error ? (
      <p>{error}</p>
    ) : (
      <>
        <p><strong>User Name</strong><br />{userData.username}</p>
        <p><strong>E-Mail</strong><br />{userData.email}</p>
        <p><strong>Password</strong><br />_</p>
        <p><strong>My interests</strong><br />
          <span className="tag">#Python</span>
          <span className="tag">#C/C++</span>
          <span className="tag">#Algorithm</span>
        </p>
      </>
    )}
  </div>
</div>
        </div>
    );
};

export default Mypage;
