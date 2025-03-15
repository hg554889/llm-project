import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import ReactDOM from 'react-dom/client';
import axios from 'axios';
//import Router from './Router'; 
import './login.css'; // CSS 파일 추가

function App() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

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

    // 메인 페이지로 이동하는 함수
    const handleIndexClick = () => {
        navigate('/'); // React Router를 이용해 메인 페이지로 이동
    };

    return (
        <div className="container"> 
            {/* 헤더 */}
            <div className="header">
                <h1 onClick={handleIndexClick}>Code Programming Runner</h1>
            </div>

            {/* 로그인 UI */}
       
        </div>
    );
}

export default App;
