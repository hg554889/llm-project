import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png'; 
import "./Note.css";

const Note = () => {
    const navigate = useNavigate(); 
    const [showSidebar, setShowSidebar] = useState(true);
    const [isGridView, setIsGridView] = useState(true);

    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleView = () => setIsGridView(!isGridView);

    return (
        <div className="note-page-container">
        <header className="note-header">
            <div className="menu-toggle" onClick={toggleSidebar}>☰</div>
            <h1>Code Programming Runner</h1>
            <div className="view-toggle" onClick={toggleView}>
            {isGridView ? "☰" : "▦"}
            </div>
        </header>

        <div className="note-content">
            {showSidebar && (
            <div className="note-sidebar">
                <div className="profile-circle-large" />
                <p className="side-name">Aurora &gt;</p>
                <p className="side-email">gudeg0702@gmail.com</p>
                <ul className="side-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=>navigate('/savedLink')}>Saved Link</li>
                <li onClick={()=>navigate('/note')}>Note</li>
                <li onClick={()=>navigate('/')}>Log Out</li>
                </ul>
            </div>
            )}

            <div className="note-main">
            <h2 className="note-title">NOTE</h2>
            <div className={isGridView ? "note-grid" : "note-list"}>
                <div className="note-card">Exemple</div>
                {/* 필요한 노트 카드 추가 */}
            </div>
            </div>
        </div>
        </div>
    );
};

export default Note;
