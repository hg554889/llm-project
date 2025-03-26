import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './login.css'; // CSS 파일 추가

const Login = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
    const [showError, setShowError] = useState(false); // 에러 표시 상태 추가
  
    // 사이드바 열기/닫기 함수
    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 하드코딩된 테스트 로그인 함수 (임시)
  const handleTestLogin = () => {
    // 테스트 계정으로 로그인
    const testEmail = "test@example.com";
    localStorage.setItem('userEmail', testEmail);
    navigate('/userMain');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    
    if (!username || !password) {
      setErrorMessage('사용자 이름/이메일과 비밀번호를 모두 입력해주세요.');
      setShowError(true);
      return;
    }
    
    try {
      // 입력된 값이 이메일 형식인지 확인
      const isEmail = username.includes('@');
      
      // 요청 데이터 구성
      const loginData = {
        ...(isEmail ? { email: username } : { username }),
        password
      };
      
      console.log('요청 데이터:', loginData);
      
      // CORS 오류 확인을 위한 옵션 설정
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: false
      };
      
      // 서버에 로그인 요청
      const response = await axios.post(
        'http://localhost:3001/login',
        loginData,
        config
      );
      
      console.log('서버 응답:', response.data);
      
      if (response.data.success) {
        // 로그인 성공
        const userEmail = response.data.user.email;
        localStorage.setItem('userEmail', userEmail);
        navigate('/userMain');
      } else {
        // 서버에서 성공하지 않은 응답
        setErrorMessage(response.data.message || '로그인에 실패했습니다.');
        setShowError(true);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      
      // 서버 응답이 있는 경우
      if (error.response) {
        console.log('서버 응답 오류:', error.response.data);
        setErrorMessage(error.response.data.message || '로그인에 실패했습니다.');
      } else if (error.request) {
        console.log('서버 요청 오류:', error.request);
        setErrorMessage('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      } else {
        console.log('요청 오류:', error.message);
        setErrorMessage('요청 중 오류가 발생했습니다.');
      }
      
      setShowError(true);
      
      // 개발 테스트용 - 임시 테스트 로그인 기능 추가
      if (username === "test@example.com" && password === "test123") {
        handleTestLogin();
      }
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
          <i className="fa-solid fa-user-plus" onClick={() => navigate('/login')}></i>
          <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
        </div>
      </div>

      <div className="login-container">
        <div className="login-box">
          <h2>Log In</h2>
          <h2>Hi My Runner :)</h2> 

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name or E-Mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="options">
              {/*비번 아이디 찾는 페이지로*/}
              <a href="/findInfo" onClick={(e) => {e.preventDefault(); navigate('/findId');}}>Find ID/Password</a>
            </div>

            {/* 오류 메시지 표시 */}
            {showError && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {/* 버튼에서 navigate 직접 호출 제거 - form 제출 시 handleSubmit에서 처리 */}
            <button type="submit" className="continue-btn">
              Continue
            </button>
          </form>

          {/* 개발 테스트용 임시 로그인 버튼 */}
          <button 
            onClick={handleTestLogin}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            테스트 계정으로 로그인 (개발용)
          </button>

          {/*회원가입 페이지로*/}
          <a href="/signIn" className="register-link" onClick={(e) => {e.preventDefault(); navigate('/signIn');}}>
            Create Your Account
          </a>
        </div>
      </div>
    </div>
  );
};
  

export default Login;
