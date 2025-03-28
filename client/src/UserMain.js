import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import './UserMain.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <pre className={className}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
};

const UserMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);

  // 사용자 정보 및 기본 데이터 로드
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/login');
          return;
        }

        // 사용자 정보 불러오기 (기존 API)
        const response = await axios.get(`http://localhost:3001/userMain/${userEmail}`);
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setUserData({ 
            username: userEmail.split('@')[0],
            email: userEmail 
          });
        }
      } catch (err) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setUserData({ 
            username: userEmail.split('@')[0],
            email: userEmail 
          });
        } else {
          setError('사용자 정보를 불러오는 데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchUserData();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  // 백엔드 DB에서 사용자별 채팅 기록 불러오기 (페이지 로드시)
  useEffect(() => {
    const fetchChatHistory = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      try {
        const response = await axios.get('http://localhost:3001/chatHistory', {
          params: { userEmail }
        });
        if (response.data.success) {
          setChatHistory(response.data.messages);
        }
      } catch (error) {
        console.error('대화 기록 불러오기 오류:', error);
      }
    };

    fetchChatHistory();
  }, []);

  // 새로운 메시지가 추가될 때마다 채팅창 스크롤을 맨 아래로
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 채팅 세션 목록 불러오기
  useEffect(() => {
    const fetchSessions = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      try {
        const response = await axios.get('http://localhost:3001/chat/sessions', {
          params: { userEmail }
        });
        if (response.data.success) {
          setChatSessions(response.data.sessions);
        }
      } catch (error) {
        console.error('세션 목록 조회 오류:', error);
      }
    };

    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 메시지를 DB에 저장하는 함수
  const saveMessageToDB = async (message) => {
    try {
      await axios.post('http://localhost:3001/chat/message', {
        sessionId: currentSessionId,
        role: message.role,
        content: message.content
      });
    } catch (error) {
      console.error('메시지 저장 오류:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await axios.post('http://localhost:3001/chat/session', {
        userEmail: localStorage.getItem('userEmail')
      });
      
      if (response.data.success) {
        setCurrentSessionId(response.data.sessionId);
        setChatHistory([]);
        setSearchQuery('');
        // 세션 목록 새로고침
        const sessionsResponse = await axios.get('http://localhost:3001/chat/sessions', {
          params: { userEmail: localStorage.getItem('userEmail') }
        });
        if (sessionsResponse.data.success) {
          setChatSessions(sessionsResponse.data.sessions);
        }
      }
    } catch (error) {
      console.error('세션 생성 오류:', error);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/chat/sessions', {
        params: { userEmail: localStorage.getItem('userEmail') }
      });
      
      if (response.data.success) {
        setChatSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('세션 목록 조회 오류:', error);
    }
  };

  const fetchSessionMessages = async (sessionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/chat/messages/${sessionId}`);
      if (response.data.success) {
        setChatHistory(response.data.messages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('메시지 조회 오류:', error);
    }
  };

  const handleSendQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isProcessing) return;

    // 새로운 채팅이면 세션 생성
    if (!currentSessionId) {
      await createNewSession();
    }

    const question = searchQuery.trim();
    setSearchQuery('');
    setIsProcessing(true);

    const newUserMessage = {
      sessionId: currentSessionId,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    saveMessageToDB(newUserMessage);

    const loadingMessageId = Date.now() + 1;
    const loadingMessage = {
      id: loadingMessageId,
      role: 'assistant',
      content: '답변을 생성 중입니다...',
      isLoading: true,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, loadingMessage]);

    try {
      const response = await axios.post('http://localhost:3001/ai/generate', {
        sessionId: currentSessionId,
        textGen: question
      });

      let aiResponseContent = response.data.chatbot_response;
      if (typeof aiResponseContent === 'object') {
        aiResponseContent = JSON.stringify(aiResponseContent, null, 2);
      }

      const aiMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: String(aiResponseContent),
        timestamp: new Date().toISOString()
      };

      // 로딩 메시지 제거 후, AI 메시지 추가
      setChatHistory(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [...filteredMessages, aiMessage];
      });
      saveMessageToDB(aiMessage);

      // History 업데이트
      if (isNewChat) {
        const userEmail = localStorage.getItem('userEmail');
        const historyItems = JSON.parse(localStorage.getItem(`searchHistory_${userEmail}`) || '[]');
        const currentHistory = historyItems[0];
        
        if (currentHistory) {
          currentHistory.messages = [...chatHistory, newUserMessage, aiMessage];
          localStorage.setItem(`searchHistory_${userEmail}`, JSON.stringify(historyItems));
        }
      }

      setIsNewChat(false);

      // 세션 목록 새로고침
      const sessionsResponse = await axios.get('http://localhost:3001/chat/sessions', {
        params: { userEmail: localStorage.getItem('userEmail') }
      });
      if (sessionsResponse.data.success) {
        setChatSessions(sessionsResponse.data.sessions);
      }
    } catch (error) {
      console.error('AI 응답 오류:', error);
      const errorMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: '죄송합니다. 응답 생성 중에 오류가 발생했습니다. 다시 시도해 주세요.',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [...filteredMessages, errorMessage];
      });
      saveMessageToDB(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // History 저장 함수 추가
  const saveToHistory = () => {
    if (chatHistory.length === 0) return;
    
    const userEmail = localStorage.getItem('userEmail');
    const historyItems = JSON.parse(localStorage.getItem(`searchHistory_${userEmail}`) || '[]');
    
    // 첫 번째 사용자 메시지를 제목으로 사용
    const firstUserMessage = chatHistory.find(msg => msg.role === 'user');
    if (!firstUserMessage) return;

    const newHistoryItem = {
      id: Date.now(),
      question: firstUserMessage.content,
      timestamp: new Date().toISOString(),
      messages: chatHistory // 전체 대화 내용 저장
    };

    const updatedHistory = [newHistoryItem, ...historyItems].slice(0, 10);
    localStorage.setItem(`searchHistory_${userEmail}`, JSON.stringify(updatedHistory));
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    // 필요 시 DB의 전체 기록 삭제 API 호출 추가 가능
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return;
      e.preventDefault();
      handleSendQuestion();
    }
  };

  // History 클릭 시 해당 채팅방의 전체 대화 내용을 복원
  const handleHistoryClick = async (sessionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/chat/messages/${sessionId}`);
      if (response.data.success) {
        setChatHistory(response.data.messages); // 채팅 기록 업데이트
        setCurrentSessionId(sessionId); // 현재 세션 ID 설정
        setIsNewChat(false); // 새로운 채팅 상태 해제
      } else {
        console.error('메시지 조회 실패:', response.data.error);
      }
    } catch (error) {
      console.error('메시지 조회 오류:', error);
    }
  };

  // History 항목 삭제 함수 추가
  const deleteHistoryItem = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3001/chat/session/${sessionId}`);
      // 세션 목록 새로고침
      const response = await axios.get('http://localhost:3001/chat/sessions', {
        params: { userEmail: localStorage.getItem('userEmail') }
      });
      if (response.data.success) {
        setChatSessions(response.data.sessions);
      }
      if (currentSessionId === sessionId) {
        setChatHistory([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('세션 삭제 오류:', error);
    }
  };

  const renderMessageContent = (message) => {
    if (message.isLoading) {
      return (
        <div className="loading-animation">
          <span>.</span><span>.</span><span>.</span>
        </div>
      );
    }

    return message.role === 'assistant' ? (
      <ReactMarkdown 
        components={MarkdownComponents}
        rehypePlugins={[rehypeHighlight]}
      >
        {message.content}
      </ReactMarkdown>
    ) : (
      <pre>{message.content}</pre>
    );
  };

  return (
    <div className="container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>History</h2>
        <ul className="chat-history-list">
          {chatSessions.map(session => (
            <li 
              key={session._id} 
              onClick={() => handleHistoryClick(session._id)} // 클릭 시 handleHistoryClick 호출
              className="history-item"
            >
              <div className="history-item-content">
                <span className="history-title">
                  {session.title || "새로운 채팅"}
                </span>
                <span className="history-date">
                  {new Date(session.lastMessageAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                className="delete-history-btn"
                onClick={(e) => deleteHistoryItem(session._id, e)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="header">
        <div className='left-section'>
          <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
          <img src={mainlogo} alt='logo' />
          <h1>CPR</h1>
        </div>

        <h1 onClick={() => {
          setChatHistory([]);
          setSearchQuery('');
          navigate('/userMain');
        }}>Code Programming Runner</h1>
        
        <div className='right-section'>
          <i className="fa-solid fa-user" onClick={toggleDropdown}></i>
          {isOpen && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-header">
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
              </div>

              <ul className="profile-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=>navigate('/savedLink')}>Saved Links</li>
                <li onClick={()=>navigate('/note')}>Note</li>
                <li onClick={handleLogout}>Log out</li>
              </ul>
            </div>
          )}
          <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
        </div>
      </div>

      <div className="chat-display" ref={chatContainerRef}>
        {chatHistory.length > 0 && (
          <div className="chat-controls">
            <button className="clear-chat-btn" onClick={clearChatHistory}>
              대화 내용 지우기
            </button>
          </div>
        )}

        {chatHistory.length === 0 ? (
          <div className="empty-chat">
            <h2>Code Programming Runner AI에 질문해보세요!</h2>
          </div>
        ) : (
          chatHistory.map(message => (
            <div 
              key={message.id} 
              className={`chat-message ${message.role} ${message.isLoading ? 'loading' : ''} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'assistant' ? 'AI' : userData.username?.charAt(0) || 'U'}
              </div>
              <div className="message-content">
                {renderMessageContent(message)}
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass"></i>
          <textarea 
            className="search-bar" 
            placeholder={isProcessing ? "답변을 생성 중입니다..." : "무엇이든 물어보세요!"} 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            disabled={isProcessing}
            rows={1}
          />
        </div>
        <div className="button-group">
          <button 
            type="button" 
            className="new-chat-btn"
            onClick={() => {
              setChatHistory([]);
              setSearchQuery('');
              setIsNewChat(true); // 새로운 채팅 상태로 설정
              const userEmail = localStorage.getItem('userEmail');
              if (userEmail) {
                localStorage.removeItem(`chatHistory_${userEmail}`);
              }
            }}
          >
            새로운 채팅 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
