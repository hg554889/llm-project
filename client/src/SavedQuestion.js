import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./SavedQuestion.css";

const SavedQuestion = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate(); 
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div className="saved-question-container">
        <header className="saved-question-header">
            <div className="menu-toggle" onClick={toggleSidebar}>☰</div>
            <h1>Code Programming Runner</h1>
            <div className="profile-dot"></div>
        </header>

        <div className="saved-question-content">
            {showSidebar && (
            <div className="saved-question-sidebar">
                <div className="profile-circle-large" />
                <p className="side-name">Aurora &gt;</p>
                <p className="side-email">gudeg0702@gmail.com</p>
                <ul className="side-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=> navigate('/savedLink')}>Saved Link</li>
                <li>Note</li>
                <li onClick={()=>('/')}>Log Out</li>
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
