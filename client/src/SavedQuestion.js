import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import "./SavedQuestion.css";

const SavedQuestion = () => {
        const navigate = useNavigate(); 
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionMessages, setSessionMessages] = useState([]);

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

    // 채팅 세션 목록 불러오기
    useEffect(() => {
        const fetchChatSessions = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) return;
            
            try {
                const response = await axios.get('http://localhost:3001/chat/sessions', {
                    params: { userEmail }
                });
                if (response.data.success) {
                    setChatSessions(response.data.sessions.sort((a, b) => 
                        new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
                    ));
                }
            } catch (error) {
                console.error('세션 목록 조회 오류:', error);
            }
        };

        fetchChatSessions();
    }, []);

    // 세션 메시지 불러오기와 토글 기능
    const handleSessionClick = async (sessionId) => {
        if (selectedSession === sessionId) {
            // 이미 선택된 세션을 다시 클릭하면 닫기
            setSelectedSession(null);
            setSessionMessages([]);
        } else {
            // 다른 세션을 클릭하면 해당 세션의 메시지 불러오기
            try {
                const response = await axios.get(`http://localhost:3001/chat/messages/${sessionId}`);
                if (response.data.success) {
                    setSessionMessages(response.data.messages);
                    setSelectedSession(sessionId);
                }
            } catch (error) {
                console.error('메시지 조회 오류:', error);
            }
        }
    };

    return (
        <div className="saved-question-container">
            <div className="header">
                <div className='left-section'>
                    <img src={mainlogo} alt='logo' />
                    <h1>CPR</h1>
                </div>
              
                <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1>
              
                <div className='right-section'>
                    <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                    {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                    <i class="fa-solid fa-layer-group" onClick={() => navigate('/NoteP')}></i>
                </div>
            </div>

            <div className="saved-question-content">
                <div className="profile-card">
                    <div className="profile-circle" />
                    <div className="profile-info">
                        {loading ? (
                            <p>로딩 중...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <>
                                <p className="profile-name">{userData.username}</p>
                                <p className="profile-email">{userData.email}</p>
                            </>
                        )}
                    </div>
                    <ul className="profile-menu">
                        <li onClick={() => navigate('/myPage')}>My Page</li>
                        <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
                        <li onClick={() => navigate('/savedLink')}>Saved Links</li>
                        <li onClick={() => navigate('/')}>Log out</li>
                    </ul>
                </div>

                <div className="saved-question-main">
                    <h2 className="saved-question-title">Saved Questions</h2>
                    <div className="question-list">
                        {chatSessions.map(session => (
                            <div
                                key={session._id}
                                className={`question-card ${selectedSession === session._id ? 'selected' : ''}`}
                                onClick={() => handleSessionClick(session._id)}
                            >
                                <div className="question-header">
                                    <span className="question-title">
                                        {session.title || "새로운 채팅"}
                                    </span>
                                    <span className="question-date">
                                        {new Date(session.lastMessageAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {selectedSession === session._id && (
                                    <div className="message-list">
                                        {sessionMessages.map((message, index) => (
                                            <div 
                                                key={index}
                                                className={`message ${message.role}`}
                                            >
                                                <div className="message-avatar">
                                                    {message.role === 'assistant' ? 'AI' : userData.username?.charAt(0) || 'U'}
                                                </div>
                                                <div className="message-content">
                                                    <pre>{message.content}</pre>
                                                    <div className="message-time">
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedQuestion;
