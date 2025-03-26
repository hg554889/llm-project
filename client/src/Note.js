import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png'; 
import "./Note.css";

const Note = () => {
    const navigate = useNavigate(); 
    const [showSidebar, setShowSidebar] = useState(true);
    const [isGridView, setIsGridView] = useState(true);
    const [notes, setNotes] = useState(["Example"]);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const addNote = () => {
        const newNoteTitle = `New Note ${notes.length + 1}`;
        setNotes([...notes, newNoteTitle]);
    };

    return (
        <div className="note-page-container">
            <div className="header">
                <div className='left-section'>
                    <i className="fa-sharp fa-solid fa-bars" onClick={toggleSidebar}></i>
                    <img src={mainlogo} alt='logo' /> {/* ← 이 부분이 mainlogo.png 로고 */}
                    <h1>CPR</h1>
                </div>

                <h1 onClick={() => navigate('/userMain')}>Code Programming Runner</h1>
                
                <div className='right-section'>
                    <i className="fa-solid fa-user" onClick={() => navigate('')}></i>
                    <i className="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                </div>
            </div>

            <div className="note-content">
                {showSidebar && (
                    <div className="note-sidebar">
                        <div className="profile-circle-large" />
                        <p className="side-name">Aurora &gt;</p>
                        <p className="side-email">gudeg0702@gmail.com</p>
                        <ul className="side-menu">
                            <li onClick={() => navigate('/myPage')}>My Page</li>
                            <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
                            <li onClick={() => navigate('/savedLink')}>Saved Link</li>
                            <li onClick={() => navigate('/note')}>Note</li>
                            <textarea className="profile-note" placeholder="Write a note..." />
                            <li onClick={() => navigate('/')}>Log Out</li>
                        </ul>
                    </div>
                )}

                <div className="note-main">
                    <div className="note-title-wrapper">
                        <h2 className="note-title">NOTE</h2>
                        <button className="add-note-button" onClick={addNote}>+</button>
                    </div>

                    <div className={isGridView ? "note-grid" : "note-list"}>
                        {notes.map((note, index) => (
                            <div className="note-card" key={index}>
                                {note}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Note;
