import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css'; // 스타일링을 위해 CSS 파일 추가

function App() {
  const [message, setMessage] = useState('');

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

  return (
    <div className="container">
      <div className="header">
        <i className="fa-sharp fa-solid fa-bars"></i>
        <img src="/img/Job-A_icon.jpg" alt="Job Assistance Icon" />
        <h1>JOB-Assisitence</h1>
        <i className="fa-solid fa-user"></i>
        <i class="fa-solid fa-gear"></i>
      </div>

      <div className="content">
        <h1>{message}</h1>
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
