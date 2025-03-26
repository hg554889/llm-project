import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png';
import './UserMain.css';

const UserMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        
        <div className='right-section' >
          <i className="fa-solid fa-user" onClick={toggleDropdown}></i>
          {isOpen && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-header">
                <div className="profile-circle" />
                <div className="profile-info">
                  <p className="profile-name">Aurora &gt;</p>
                  <p className="profile-email">gudeg0702@gmail.com</p>
                </div>
              </div>

              <ul className="profile-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=>navigate('/savedLink')}>Saved Links</li>
                <li onClick={()=>navigate('/note')}>Note</li>
                <li onClick={()=>navigate('/')}>Log out</li>
              </ul>
            </div>
          )}
          <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
        </div>
      </div>
 
      <div className="search-container">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>

      <div className="content">
      </div>
    </div>
  );
}

export default UserMain;
