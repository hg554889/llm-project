import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import './signIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordchk: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.passwordchk) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            setShowErrorPopup(true);
            return;
        }
        
        if (!agreeTerms) {
            setErrorMessage("개인정보 취급방침에 동의해주세요.");
            setShowErrorPopup(true);
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:3001/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.passwordchk
            });

            if (response.data.success) {
                setShowSuccessPopup(true);
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            const message = error.response?.data?.message || "서버 오류가 발생했습니다.";
            setErrorMessage(message);
            setShowErrorPopup(true);
        }
    };

    return (
        <div className="signin-page-container">
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

            <div className="signIn-container">
                <div className="signIn-box">
                    <h2>Create Your Account !</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="User Name"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-Mail(ID@example.com)"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="passwordchk"
                            placeholder="Password Checking"
                            value={formData.passwordchk}
                            onChange={handleChange}
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

                        <button type="submit" className="continue-btn">
                            Continue
                        </button>
                    </form>

                    <a href="/login" onClick={(e) => {e.preventDefault(); navigate('/login');}}>
                        Do You Have Your Own Account? Log in!
                    </a>
                </div>
            </div>

            {showSuccessPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>회원가입이 완료되었습니다.</p>
                        <p>잠시 후 로그인 페이지로 이동합니다...</p>
                    </div>
                </div>
            )}
            
            {showErrorPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-btn" onClick={() => setShowErrorPopup(false)}>×</span>
                        <p>{errorMessage}</p>
                        <button onClick={() => setShowErrorPopup(false)}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignIn;
