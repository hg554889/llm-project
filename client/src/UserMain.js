import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png';
import './UserMain.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import nlp from 'compromise';
import 'highlight.js/styles/github.css';

const keywordMap = {
  array: ['배열', '리스트', 'array'],
  string: ['문자열', 'string'],
  sort: ['정렬', 'sort', '오름차순', '내림차순'],
  search: ['탐색', 'search', '찾기', '이진 탐색'],
  graph: ['그래프', 'graph'],
  tree: ['트리', 'tree'],
  stack: ['스택', 'stack'],
  queue: ['큐', 'queue'],
  recursive: ['재귀', 'recursive'],
  dynamic: ['동적 계획법', 'dp', 'dynamic'],
  'linked list': ['연결 리스트', 'linked list'],
  hash: ['해시', 'hash'],
  binary: ['이진수', 'binary'],
  algorithm: ['알고리즘', 'algorithm']
};

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
  const [problems, setProblems] = useState([]); // 백준 문제 목록
  const [showProblems, setShowProblems] = useState(false); // 문제 목록 표시 여부
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [showKeywordSelection, setShowKeywordSelection] = useState(false);
  const predefinedKeywords = [
    'math', 'implementation', 'dp', 'data_structures', 'graphs',
    'greedy', 'string', 'bruteforcing', 'graph_traversal', 'sorting',
    'ad_hoc', 'geometry', 'number_theory', 'trees', 'segtree',
    'binary_search', 'arithmetic', 'constructive', 'simulation', 'prefix_sum',
    'bfs', 'combinatorics', 'case_work', 'dfs', 'shortest_path',
    'bitmask', 'hash_set', 'dijkstra', 'backtracking', 'sweeping'
  ];

  // 키워드 선택 처리 함수
  const handleKeywordSelect = (keyword) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };

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
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      
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

  // 새로운 채팅 시작 함수 수정
  const startNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:3001/chat/session', {
        userEmail: localStorage.getItem('userEmail'),
        title: "새로운 채팅" // 기본 제목 설정
      });
      
      if (response.data.success) {
        setCurrentSessionId(response.data.sessionId);
        setChatHistory([]); // 채팅 기록 초기화
        setSearchQuery('');
        setIsNewChat(true);
        await fetchChatSessions(); // 세션 목록 새로고침
      }
    } catch (error) {
      console.error('새 채팅 세션 생성 오류:', error);
    }
  };

  // handleSendQuestion 함수 수정
  const handleSendQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isProcessing) return;

    // 새로운 채팅이면 세션 생성
    if (!currentSessionId) {
      await startNewChat();
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

    // 현재 세션의 채팅 기록에 추가
    setChatHistory(prev => [...prev, newUserMessage]);
    await saveMessageToDB(newUserMessage);

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
        sessionId: currentSessionId,
        role: 'assistant',
        content: String(aiResponseContent),
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        return [...filteredMessages, aiMessage];
      });
      
      await saveMessageToDB(aiMessage);
      await fetchChatSessions(); // 세션 목록 업데이트

      setIsNewChat(false);
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

  // 선택된 키워드로 문제 검색
  const searchWithSelectedKeywords = async () => {
    if (selectedKeywords.length === 0) {
      alert('키워드를 선택해주세요.');
      return;
    }

    const tag = selectedKeywords.join(' ');
    console.log('Searching with keywords:', tag);

    try {
      const encodedTag = encodeURIComponent(tag);
      console.log('Encoded tag:', encodedTag);

      const response = await axios.get(`http://localhost:3001/list/beakjoon`, {
        params: { tag: encodedTag },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.length > 0) {
        setProblems(response.data);
        setShowProblems(true);
        setShowKeywordSelection(false);
      } else {
        alert('관련 문제를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('문제 검색 실패:', error.response?.data || error.message);
      alert('문제를 가져오는데 실패했습니다.');
    }
  };

  const fetchProblems = async (tag) => {
    console.log('Fetching problems with tag:', tag); // 디버깅용 로그
    try {
      if (!tag) {
        console.error('No tags provided');
        alert('관련 문제를 찾을 수 없습니다.');
        return;
      }

      const encodedTag = encodeURIComponent(tag);
      console.log('Encoded tag:', encodedTag); // 디버깅용 로그

      const response = await axios.get(`http://localhost:3001/list/beakjoon`, {
        params: { tag: encodedTag },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('API Response:', response.data); // 디버깅용 로그
      
      if (response.data && response.data.length > 0) {
        setProblems(response.data);
        setShowProblems(true);
      } else {
        alert('관련 문제를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('백준 문제 가져오기 실패:', error.response?.data || error.message);
      alert('문제 목록을 가져오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  // renderMessageContent 함수 수정
  const renderMessageContent = (message) => {
    if (message.isLoading) {
      return (
        <div className="loading-animation">
          <span>.</span><span>.</span><span>.</span>
        </div>
      );
    }

    return (
      <div>
        {message.role === 'assistant' ? (
          <>
            <ReactMarkdown 
              components={MarkdownComponents}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
            <button 
              className="additional-study-btn"
              onClick={() => {
                setExtractedKeywords(predefinedKeywords);
                setSelectedKeywords([]);
                setShowKeywordSelection(true);
              }}
            >
              추가 학습
            </button>
            {showKeywordSelection && (
              <div className="keyword-selection">
                <h4>관련 키워드</h4>
                <div className="keyword-list">
                  {predefinedKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      className={`keyword-chip ${selectedKeywords.includes(keyword) ? 'selected' : ''}`}
                      onClick={() => handleKeywordSelect(keyword)}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
                <div className="keyword-actions">
                  <button onClick={searchWithSelectedKeywords}>선택한 키워드로 검색</button>
                  <button onClick={() => setShowKeywordSelection(false)}>취소</button>
                </div>
              </div>
            )}
            {showProblems && problems.length > 0 && (
              <div className="problem-list">
                <h3>관련 백준 문제</h3>
                <div className="problems">
                  {problems.map((problem) => (
                    <a 
                      key={problem.problemId} 
                      href={problem.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="problem-item"
                    >
                      <span className="problem-title">{problem.titleKo}</span>
                      <span className="problem-level">Level: {problem.level}</span>
                    </a>
                  ))}
                </div>
                <button 
                  className="close-problems-btn"
                  onClick={() => setShowProblems(false)}
                >
                  닫기
                </button>
              </div>
            )}
          </>
        ) : (
          <pre>{message.content}</pre>
        )}
      </div>
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
            {/* <button className="clear-chat-btn" onClick={clearChatHistory}>
              대화 내용 지우기
            </button> */}
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
                <div class="message-time">
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
            onClick={startNewChat} // 새로운 채팅 시작 함수 연결
          >
            새로운 채팅 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
