import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import './login.css';

const Login = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowError(false);
        
        if (!username || !password) {
            setErrorMessage('사용자 이름/이메일과 비밀번호를 모두 입력해주세요.');
            setShowError(true);
            return;
        }
        
        try {
            const isEmail = username.includes('@');
            const loginData = {
                ...(isEmail ? { email: username } : { username }),
                password
            };
            
            console.log('요청 데이터:', loginData);
            
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            };
            
            const response = await axios.post(
                'http://localhost:3001/login',
                loginData,
                config
            );
            
            console.log('서버 응답:', response.data);
            
            if (response.data.success) {
                const userEmail = response.data.user.email;
                localStorage.setItem('userEmail', userEmail);
                navigate('/userMain');
            } else {
                setErrorMessage(response.data.message || '로그인에 실패했습니다.');
                setShowError(true);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            
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
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className='left-section'>
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
                            <a href="/findInfo" onClick={(e) => {e.preventDefault(); navigate('/findId');}}>Find ID/Password</a>
                        </div>

                        {showError && (
                            <div className="error-message">
                                {errorMessage}
                            </div>
                        )}

                        <button type="submit" className="continue-btn">
                            Continue
                        </button>
                    </form>

                    <a href="/signIn" className="register-link" onClick={(e) => {e.preventDefault(); navigate('/signIn');}}>
                        Create Your Account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
