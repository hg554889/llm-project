import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './login_temp.css'; // CSS 파일 추가

const Login_temp = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

      // 사이드바 열기/닫기 함수
    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !newPassword || !newPasswordConfirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
  
    if (newPassword !== newPasswordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/findp', {
        username,
        newPassword
      });
  
      if (response.data.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login');
      } else {
        alert('비밀번호 변경 실패: ' + response.data.message);
      }
    } catch (err) {
      console.error('비밀번호 변경 오류:', err);
      alert('서버 오류가 발생했습니다.');
    }
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
          <i className="fa-solid fa-user-plus" ></i>
          <i className="fa-solid fa-layer-group" ></i>
        </div>
      </div>

      <div className="loginT-container">
        <div className="loginT-box">
          <h2>You Log In With Temporary Password!</h2>
          <h2>Please Change Your Password :)</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Reset Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password Check"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              />

            {/*로그인인 페이지로로*/}
            <button type="submit" className="continue-btn" onClick={() => navigate('/login')}>
              Continue
            </button>
          </form>

          {/*로그인 페이지로*/}
          <a href="/signIn" className="register-link" onClick={(e) => {e.preventDefault(); navigate('/login');}}>
            Back to Log in
          </a>
        </div>
      </div>
    </div>
  );
};
  

export default Login_temp;
