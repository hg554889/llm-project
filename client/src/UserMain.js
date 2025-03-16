import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import ReactDOM from 'react-dom/client';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
//import Router from './Router'; 
import './UserMain.css'; // CSS 파일 추가

const UserMain = () => {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate(); // React Router를 사용한 페이지 이동

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
          <h1>CPR</h1>
          </div>

          <h1 onClick={() => navigate('/')}>Code Programming Runner</h1>
          
          <div className='right-section'>
          <i className="fa-solid fa-user" onClick={() => navigate('/myPage')}></i>
          <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
          </div>
        </div>
 
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>
  

      {/*백용 콘텐트 따로 빼둠둠*/}
      <div className="content">
        <h1>{message}</h1>
      </div>
      
    </div>
  );
}


export default UserMain;
