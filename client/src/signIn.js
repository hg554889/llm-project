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
    const [errorMessage, setErrorMessage] = useState(""); // 추가: 오류 메시지 상태
    const [showErrorPopup, setShowErrorPopup] = useState(false); // 추가: 오류 팝업 상태
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // 추가: 성공 팝업 상태
    const [agreeTerms, setAgreeTerms] = useState(false); // 추가: 약관 동의 상태
  
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
    
    // 비밀번호 일치 검사
    if (password !== passwordchk) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      setShowErrorPopup(true);
      return;
    }
    
    // 필수 약관 동의 확인
    if (!agreeTerms) {
      setErrorMessage("개인정보 취급방침에 동의해주세요.");
      setShowErrorPopup(true);
      return;
    }
    
    // 백엔드 API 호출
    axios.post('http://localhost:3001/register', {
      username,
      email,
      password,
      confirmPassword: passwordchk
    })
    .then(response => {
      if (response.data.success) {
        // 회원가입 성공
        setShowSuccessPopup(true);
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // 서버에서 success: false로 응답한 경우
        setErrorMessage(response.data.message || "회원가입에 실패했습니다.");
        setShowErrorPopup(true);
      }
    })
    .catch(error => {
      console.error('회원가입 오류:', error);
      
      // 서버 응답에 메시지가 있으면 해당 메시지 표시
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      setShowErrorPopup(true);
    });
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
              onChange={(e) => setPasswordchk(e.target.value)}
              required
            />

            <div className="options">
              <label>
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <span>(필수) 개인정보 취급방침에 대한 안내</span>
              </label>
            </div>

            {/* 버튼에서 navigate 직접 호출 제거 */}
            <button type="submit" className="continue-btn">
              Continue
            </button>
          </form>

          {/*로그인 페이지로*/}
          <a href="/login" className="register-link" onClick={(e) => {e.preventDefault(); navigate('/login');}}>
            Do You Have Your Own Account? Log in!
          </a>
        </div>
      </div>

      {/* 성공 팝업 추가 */}
      {showSuccessPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close-btn" onClick={() => setShowSuccessPopup(false)}>×</span>
            </div>
            <p>회원가입이 완료되었습니다.</p>
            <p>잠시 후 로그인 페이지로 이동합니다...</p>
            <button onClick={() => navigate('/login')}>확인</button>
          </div>
        </div>
      )}
      
      {/* 오류 메시지 팝업 추가 */}
      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close-btn" onClick={() => setShowErrorPopup(false)}>×</span>
            </div>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorPopup(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};
  

export default SignIn;
