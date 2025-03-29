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
    const [savedLinks, setSavedLinks] = useState([]);

    const learningResources = [
        {
            name: "Codecademy",
            description: "대화형 방식으로 기초부터 실습까지 가능",
            url: "https://www.codecademy.com"
        },
        {
            name: "freeCodeCamp",
            description: "HTML, CSS, JavaScript부터 백엔드까지 무료 코스 제공",
            url: "https://www.freecodecamp.org"
        },
        {
            name: "Khan Academy",
            description: "코딩 애니메이션과 영상으로 쉽게 배울 수 있음",
            url: "https://www.khanacademy.org/computing/computer-programming"
        },
        {
            name: "Coursera",
            description: "전 세계 유명 대학들의 강의를 수강 가능 (예: Stanford, Harvard)",
            url: "https://www.coursera.org"
        },
        {
            name: "edX",
            description: "하버드, MIT 등 대학 강의 포함. 인증서도 발급 가능",
            url: "https://www.edx.org"
        },
        {
            name: "Udemy",
            description: "다양한 강의가 있으며 세일 시 저렴하게 수강 가능",
            url: "https://www.udemy.com"
        },
        {
            name: "LeetCode",
            description: "알고리즘 & 코딩 인터뷰 대비 문제 사이트",
            url: "https://leetcode.com"
        },
        {
            name: "HackerRank",
            description: "실전 코딩 문제를 언어별로 연습 가능",
            url: "https://www.hackerrank.com"
        },
        {
            name: "Codewars",
            description: "난이도별로 문제를 풀며 레벨업하는 방식",
            url: "https://www.codewars.com"
        },
        {
            name: "Frontend Mentor",
            description: "실제 웹사이트처럼 디자인된 UI를 구현해보는 프로젝트 제공",
            url: "https://www.frontendmentor.io"
        },
        {
            name: "The Odin Project",
            description: "웹 개발을 위한 무료 풀스택 커리큘럼 제공",
            url: "https://www.theodinproject.com"
        },
        {
            name: "Scrimba",
            description: "인터랙티브한 방식으로 프론트엔드 기술 학습",
            url: "https://scrimba.com"
        }
    ];

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

        // 사용자별 저장된 링크 불러오기
        const userEmail = localStorage.getItem('userEmail');
        const savedLinksData = localStorage.getItem(`savedLinks_${userEmail}`);
        if (savedLinksData) {
            setSavedLinks(JSON.parse(savedLinksData));
        }
    }, [navigate]);

    const toggleSaveLink = (resource) => {
        const userEmail = localStorage.getItem('userEmail');
        setSavedLinks(prev => {
            let newSavedLinks;
            const isAlreadySaved = prev.some(link => link.url === resource.url);
            if (isAlreadySaved) {
                newSavedLinks = prev.filter(link => link.url !== resource.url);
            } else {
                newSavedLinks = [...prev, resource];
            }
            // 사용자별로 저장
            localStorage.setItem(`savedLinks_${userEmail}`, JSON.stringify(newSavedLinks));
            return newSavedLinks;
        });
    };

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
                                <p className="profile-name">{userData.username}</p>
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
                    <div className="savedlink-header">
                        <h2 className="savedlink-title">Learning Resources</h2>
                    </div>
                    <div className="resources-list">
                        {learningResources.map((resource, index) => (
                            <div key={index} className="link-item">
                                <div className="link-info">
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        <strong>{resource.name}</strong>
                                    </a>
                                    <p>{resource.description}</p>
                                </div>
                                <button 
                                    className={`save-button ${savedLinks.some(link => link.url === resource.url) ? 'saved' : ''}`}
                                    onClick={() => toggleSaveLink(resource)}
                                >
                                    {savedLinks.some(link => link.url === resource.url) ? '저장됨' : '저장하기'}
                                </button>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedLink;
