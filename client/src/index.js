import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './App.css'; // 스타일링을 위해 CSS 파일 추가

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
        <h1>JOB-Assisitence</h1>
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
