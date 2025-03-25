import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png'; 
import "./Note.css";

const Note = () => {
    const navigate = useNavigate(); 
    const [showSidebar, setShowSidebar] = useState(true);
    const [isGridView, setIsGridView] = useState(true);

    const toggleSidebar = () => setShowSidebar(!showSidebar);


    return (
        <div className="note-page-container">
         <div className="header">
                          <div className='left-section'>
                          <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
                           <img src={mainlogo} alt='logo' />
                          <h1 >CPR</h1>
                          </div>
                
                          <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1> {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                        
                          <div className='right-section'>
                          <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                          {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                          <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                          </div>
                        </div>

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
                <textarea className="profile-note" placeholder="Write a note..." />
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
