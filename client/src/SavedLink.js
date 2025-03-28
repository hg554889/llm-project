import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; 
import "./SavedLink.css";

const SavedLink = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    navigate('/login');
                    return;
                }
                
                try {
                    const response = await axios.get(`http://localhost:3001/userMain/${userEmail}`);
                    if (response.data.success) {
                        setUserData(response.data.data);
                    }
                } catch (err) {
                    // API 호출 실패 시 기본 처리
                    setUserData({
                        username: userEmail.split('@')[0],
                        email: userEmail
                    });
                }
            } catch (err) {
                setError('사용자 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, [navigate]);

    return (
        <div className="savedlink-container">
            <div className="header">
                <div className='left-section'>
                    {/* Remove sidebar toggle icon */}
                    <img src={mainlogo} alt='logo' />
                    <h1>CPR</h1>
                </div>
                
                <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1> 
                        
                <div className='right-section'>
                    <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                    {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                    <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                </div>
            </div>

            <div className="savedlink-content">
                <div className="profile-card">
                    <div className="profile-circle" />
                    <div className="profile-info">
                        {loading ? (
                            <p>로딩 중...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <>
                                <p className="profile-name">{userData.username} &gt;</p>
                                <p className="profile-email">{userData.email}</p>
                            </>
                        )}
                    </div>
                    <ul className="profile-menu">
                        <li onClick={() => navigate('/myPage')}>My Page</li>
                        <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
                        <li onClick={() => navigate('/savedLink')}>Saved Links</li>
                        <li onClick={() => navigate('/note')}>Note</li>
                        <li onClick={() => navigate('/')}>Log out</li>
                    </ul>
                </div>

                <div className="savedlink-main">
                    <h2 className="savedlink-title">Saved Links</h2>
                    <div className="link-item">
                        <strong>Exemple.com</strong>
                        <hr />
                    </div>
                    {/* 링크 아이템을 더 추가할 수 있어요 */}
                </div>
            </div>
        </div>
    );
};

export default SavedLink;
