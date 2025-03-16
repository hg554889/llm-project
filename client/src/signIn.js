import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './signIn.css'; // CSS 파일 추가

const SignIn = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordchk, setPasswordchk] = useState("");
  
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
    console.log("Logging in with", username, email, password, passwordchk);
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
          <i className="fa-solid fa-user" onClick={() => navigate('/login')}></i>
          <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
        </div>
      </div>

      <div className="signIn-container">
        <div className="signIn-box">
          <h2>Create Your Account !</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="E-Mail(ID@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password Checking"
              value={passwordchk}
              onChange={(e) => passwordchk(e.target.value)}
              required
            />

            <div className="options">
            <label>
                <input type="checkbox" />
                <span>다음 약관에 모두 동의합니다.</span>
            </label>
            <label>
                <input type="checkbox" />
                <span>(필수) CPR이용약관 동의</span>
            </label>
            <label>
                <input type="checkbox" />
                <span>(필수) 개인정보 취급방침에 대한 안내</span>
            </label>
            <label>
                <input type="checkbox" />
                <span>(선택) 마케팅 정보 이메일 수신 동의</span>
            </label>
            </div>

            {/*로그인페이지로로*/}
            <button type="submit" className="continue-btn" onClick={() => navigate('/login')}>
              Continue
            </button>
          </form>

          {/*회원가입 페이지로*/}
          <a href="/login" className="register-link" onClick={(e) => {e.preventDefault(); navigate('/login');}}>
            Do You Have Your Own Account? Log in!
          </a>
        </div>
      </div>
    </div>
  );
};
  

export default SignIn;
