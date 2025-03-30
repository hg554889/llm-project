import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import './findId.css'; // CSS 파일 추가

const FindId = () => {
    const [message, setMessage] = useState(''); {/*메세지 아래 호출 안해놔서 안나오는게 맞음 */}
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    const [email, setEmail] = useState("");
    const [activeTab, setActiveTab] = useState('findId'); // 탭 상태 관리
    const [showPopup, setShowPopup] = useState(false); // ✅ 팝업 상태 관리
    const [userId, MyUserId] = useState(''); // ✅ 사용자 ID 저장
    const [errorPopupMessage, setErrorPopupMessage] = useState(''); // 추가: 오류 메시지용 팝업
    const [showErrorPopup, setShowErrorPopup] = useState(false); // 추가: 오류 팝업 상태

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

  // 이메일 형식 검증 함수 추가
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 입력 검증
    if (!email) {
      setErrorPopupMessage('이메일을 입력해주세요');
      setShowErrorPopup(true);
      return;
    }
    
    // 입력된 값이 이메일 형식인지 확인
    const isEmail = isValidEmail(email);
    
    // 백엔드 API 호출
    axios.post('http://localhost:3001/search/', { 
      // 이메일 형식이면 email 필드에, 아니면 username 필드에 전송
      ...(isEmail ? { email } : { username: email })
    })
      .then(response => {
        if (response.data.found) {
          // 사용자 정보가 발견됨
          if (isEmail) {
            // 이메일로 검색했을 때 사용자명 표시
            MyUserId(response.data.username);
          } else {
            // 사용자명으로 검색했을 때 이메일 표시
            MyUserId(response.data.email);
          }
          setShowPopup(true);
        } else {
          // 사용자 정보가 발견되지 않음
          if (isEmail) {
            setErrorPopupMessage('해당 이메일로 등록된 계정을 찾을 수 없습니다.');
          } else {
            setErrorPopupMessage('해당 username으로 가입된 이메일을 찾을 수 없습니다.');
          }
          setShowErrorPopup(true);
        }
      })
      .catch(error => {
        console.error('계정 검색 오류:', error);
        if (error.response && error.response.status === 404) {
          // 404 오류 - 사용자 정보 없음
          if (isEmail) {
            setErrorPopupMessage('해당 이메일로 등록된 계정을 찾을 수 없습니다.');
          } else {
            setErrorPopupMessage('해당 username으로 가입된 이메일을 찾을 수 없습니다.');
          }
          setShowErrorPopup(true);
        } else {
          // 기타 서버 오류
          setErrorPopupMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          setShowErrorPopup(true);
        }
      });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="left-section">
          <img src={mainlogo} alt="logo" />
          <h1>CPR</h1>
        </div>

        <h1 onClick={() => navigate('/')}>Code Programming Runner</h1>

        <div className="right-section">
          <i className="fa-solid fa-user-plus" onClick={() => navigate('/login')}></i>
          <i className="fa-solid fa-layer-group" ></i>
        </div>
      </div>

      <div className="findInfo-container">
        <div className="findInfo-box">
          <h2>Find User Name / Password</h2>

          {/* 🔹 탭 버튼 */}
          <div className="find-tabs">
            <button
              className={activeTab === 'findId' ? 'active' : ''}
              onClick={() => {setActiveTab('findId'); navigate('/findId'); }}>
              Find User Name
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
              placeholder="E-Mail"
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
            {isValidEmail(email) ? (
              <p>Your ID = "<strong>{userId}</strong>"</p>
            ) : (
              <p>Your Email = "<strong>{userId}</strong>"</p>
            )}
            <button onClick={() => navigate('/login')}>확인</button>
          </div>
        </div>
      )}
      
      {/* 오류 메시지용 커스텀 팝업 추가 */}
      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close-btn" onClick={() => setShowErrorPopup(false)}>×</span>
            </div>
            <p>{errorPopupMessage}</p>
            <button onClick={() => setShowErrorPopup(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindId;
