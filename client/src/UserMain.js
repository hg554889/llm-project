import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import './UserMain.css';

const UserMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatContainerRef = useRef(null); // 채팅 컨테이너 참조 추가
  
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 챗봇 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const fetchUserData = async () => {
      try {
        // 로컬 스토리지에서 로그인한 사용자 이메일 가져오기
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail) {
          // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
          navigate('/login');
          return;
        }
        
        // 이메일로 특정 사용자 정보 요청
        const response = await axios.get(`http://localhost:3001/userMain/${userEmail}`);
        
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          // 백엔드 API가 아직 구현되지 않은 경우를 위한 임시 처리
          setUserData({ 
            username: userEmail.split('@')[0], // 이메일에서 사용자명 추출
            email: userEmail 
          });
        }
      } catch (err) {
        console.error('사용자 정보 로딩 오류:', err);
        
        // 백엔드 API가 아직 구현되지 않은 경우를 위한 임시 처리
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setUserData({ 
            username: userEmail.split('@')[0], // 이메일에서 사용자명 추출
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
    
    // 로컬 스토리지에서 채팅 기록 불러오기
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  // 챗 히스토리가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // 새 메시지가 추가될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 로그아웃 함수
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

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // AI에 질문 전송 핸들러
  const handleSendQuestion = async (e) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim() || isProcessing) return;
    
    const question = searchQuery.trim();
    setSearchQuery('');
    setIsProcessing(true);
    
    // 사용자 질문을 채팅 기록에 추가
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    
    // 로딩 메시지 추가
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
      // AI 서버에 질문 보내기
      const response = await axios.post('http://localhost:3001/ai/generate', {
        textGen: question
      });
      
      // 로딩 메시지 제거 및 실제 응답 추가
      setChatHistory(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== loadingMessageId);
        const aiResponse = {
          id: Date.now() + 2,
          role: 'assistant',
          content: response.data.chatbot_response,
          timestamp: new Date().toISOString()
        };
        return [...filteredMessages, aiResponse];
      });
      
      // 사이드바 히스토리에 질문 추가
      const historyItems = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const newHistoryItem = {
        id: Date.now(),
        question,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [newHistoryItem, ...historyItems].slice(0, 10); // 최대 10개 유지
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      // 로딩 메시지 제거 및 오류 메시지 추가
      setChatHistory(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== loadingMessageId);
        const errorMessage = {
          id: Date.now() + 2,
          role: 'assistant',
          content: '죄송합니다. 응답 생성 중에 오류가 발생했습니다. 다시 시도해 주세요.',
          isError: true,
          timestamp: new Date().toISOString()
        };
        return [...filteredMessages, errorMessage];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 채팅 기록 지우기
  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>History</h2>
        <ul>
          {JSON.parse(localStorage.getItem('searchHistory') || '[]')
            .map(item => (
              <li key={item.id} onClick={() => setSearchQuery(item.question)}>
                {item.question.length > 25 
                  ? item.question.substring(0, 25) + '...' 
                  : item.question}
              </li>
            ))
          }
        </ul>
        {JSON.parse(localStorage.getItem('searchHistory') || '[]').length > 0 && (
          <button 
            className="clear-history-btn"
            onClick={() => {
              localStorage.removeItem('searchHistory');
              setIsSidebarOpen(false);
              setIsSidebarOpen(true);
            }}
          >
            기록 지우기
          </button>
        )}
      </div>
    
      <div className="header">
        <div className='left-section'>
          <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
          <img src={mainlogo} alt='logo' />
          <h1>CPR</h1>
        </div>

        <h1 onClick={() => navigate('/')}>Code Programming Runner</h1>
        
        <div className='right-section' >
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
                      <p className="profile-name">{userData.username} &gt;</p>
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
      
      {/* 채팅 표시 영역 추가 */}
      <div className="chat-display" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="empty-chat">
            <h2>Code Programming Runner AI에 질문해보세요!</h2>
            {/* <p>프로그래밍 문제, 코드 오류, 언어 학습에 관한 질문을 입력하세요.</p> */}
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
                {message.isLoading ? (
                  <div className="loading-animation">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  <pre>{message.content}</pre>
                )}
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="content">
        {/* 채팅 컨트롤 (기존 디자인을 유지하기 위해 필요한 경우) */}
        {chatHistory.length > 0 && (
          <div className="chat-controls">
            <button className="clear-chat-btn" onClick={clearChatHistory}>
              대화 내용 지우기
            </button>
          </div>
        )}
      </div>
 
      {/* 기존 검색창 유지하면서 기능 추가 */}
      <div className="search-container">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          className="search-bar" 
          placeholder={isProcessing ? "답변을 생성 중입니다..." : "질문을 입력하세요..."} 
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          disabled={isProcessing}
        />
        {/* 전송 버튼을 보이지 않게 추가해서 엔터키나 검색 아이콘 클릭으로 전송 */}
        <button 
          type="button" 
          className="search-submit" 
          onClick={handleSendQuestion}
          disabled={isProcessing}
          style={{ display: 'none' }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default UserMain;
