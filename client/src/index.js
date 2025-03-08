import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import JobImage from '../src/img/Job-A_icon.png';
import './index.css'; // 스타일링을 위해 CSS 파일 추가

function App() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setMessage(response.data);
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

  const handleJobClick =()=>{
    //ai 자소서 페이지
    window.location.href='/src/ai.js';
  }
  
  const handleIndexClick=()=>{
    //메인페이지로 이동
    window.location.href='/src/index.js';
  }

  const handleUserClick = () => {
    // 유저페이지로 이동
    window.location.href = '/src/user.js';  
  };

  const handleEnvirClick=()=>{
    //환경설정페이지로 이동동
    window.location.href='/src/envir/js';
  }

  const handleRshClick=()=>{
    window.location.href='/src/reseach.js';
  }

  const handleQnaClick=()=>{
    window.location.href='/src/qna.js';
  }

  const handleComClick=()=>{
    window.location.href='/src/community.js';
  }


  return (
    <div className="container">
    {/* 사이드바 */}
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <h2>Menu</h2>
      <ul>
        <li onClick={handleRshClick}>기업 검색</li>
        <li onClick={handleQnaClick}>QnA</li>
        <li onClick={handleComClick}>Community</li>
      </ul>
    </div>
    
    <div className="container">
      <div className="header">
        <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
        <img src={JobImage} onClick={handleJobClick} />
        <h1 onClick={handleIndexClick}>JOB-Assisitence</h1>
        <i className="fa-solid fa-user" onClick={handleUserClick}></i>
        <i class="fa-solid fa-gear" onClick={handleEnvirClick}></i>
      </div>

      <div className="content">
        <h1>{message}</h1>
      </div>
    </div>
    </div>
  );
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
