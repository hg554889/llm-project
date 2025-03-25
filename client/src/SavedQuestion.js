import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import "./SavedQuestion.css";

const SavedQuestion = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate(); 
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div className="saved-question-container">
      <div className="header">
                        <div className='left-section'>
                        <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
                         <img src={mainlogo} alt='logo' />
                        <h1 >CPR</h1>
                        </div>
              
                        <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1>
                      
                        <div className='right-section'>
                        <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                        {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                        <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                        </div>
                      </div>

        <div className="saved-question-content">
            {showSidebar && (
            <div className="saved-question-sidebar">
                <div className="profile-circle-large" />
                <p className="side-name">Aurora &gt;</p>
                <p className="side-email">gudeg0702@gmail.com</p>
                <ul className="side-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=>navigate('/savedLink')}>Saved Link</li>
                <li onClick={()=>navigate('/note')}>Note</li>
                <textarea className="profile-note" placeholder="Write a note..." />
                <li onClick={()=>navigate('/')}>Log Out</li>
                </ul>
            </div>
            )}

            <div className="saved-question-main">
            <h2 className="saved-question-title">Saved Questions</h2>
            <div className="question-list">
                <div className="question-card">What is the time complexity of quicksort?</div>
                <div className="question-card">Difference between var, let, and const in JavaScript</div>
                {/* 더 많은 질문 카드 추가 가능 */}
            </div>
            </div>
        </div>
        </div>
    );
};

export default SavedQuestion;
