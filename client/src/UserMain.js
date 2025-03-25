import React, { useState, useEffect, useRef } from 'react';
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
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
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

      useEffect(() => {
          const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setIsOpen(false);
          }
          };
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          };
      }, []);


  // 사이드바 열기/닫기 함수
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
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
          <i className="fa-solid fa-user" onClick={toggleDropdown}></i>
          {isOpen && (
            <div className="profile-dropdown">
            <div className="profile-header">
                <div className="profile-circle" />
                <div className="profile-info">
                <p className="profile-name">Aurora &gt;</p>
                <p className="profile-email">gudeg0702@gmail.com</p>
                </div>
            </div>

            <ul className="profile-menu">
                <li onClick={() => navigate('./myPage')}>My Page</li>
                <li onClick={() => navigate('./savedQ')}>Saved Questions</li>
                <li onClick={() => navigate('./savedLink')}>Saved Links</li>
                <li>Customer Service</li>
                <li onClick={()=> navigate('/')}>Log out</li>
            </ul>
            </div>
        )}
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
