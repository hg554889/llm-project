import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import mainlogo from './img/mainlogo.png'; 
import "./Note.css";

const Note = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(true);
    const [isGridView, setIsGridView] = useState(true);
    const [notes, setNotes] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [newNote, setNewNote] = useState({
        title: '',
        content: ''
    });
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState({ title: '', content: '' });

    const fetchNotes = useCallback(async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:3001/memo?userId=${userEmail}`);
            if (response.data) {
                setNotes(response.data);
            }
        } catch (err) {
            console.error('노트 로딩 오류:', err);
            alert(err.response?.data?.message || "노트 로딩에 실패했습니다.");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                navigate('/login');
                return;
            }
            
            try {
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
                console.error('사용자 정보 로딩 오류:', err);
            }
        };

        fetchUserData();
        fetchNotes();
    }, [navigate, fetchNotes]);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const handleCreateNote = async () => {
        if (!newNote.title || !newNote.content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                alert("로그인이 필요합니다.");
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:3001/memo', {
                title: newNote.title,
                content: newNote.content,
                userId: userEmail
            });

            if (response.status === 201) {
                // 노트 저장 후 목록 새로고침
                await fetchNotes();
                
                // 입력 폼 초기화 및 닫기
                setIsCreating(false);
                setNewNote({ title: '', content: '' });
                
                alert("노트가 성공적으로 저장되었습니다.");
            } else {
                throw new Error('노트 저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('노트 생성 오류:', err);
            alert(err.response?.data?.message || "노트 저장에 실패했습니다.");
        }
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setEditedNote(note);
    };

    const handleEditNote = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const response = await axios.put(`http://localhost:3001/memo/${editedNote._id}`, {
                title: editedNote.title,
                content: editedNote.content,
                userId: userEmail
            });

            if (response.status === 200) {
                await fetchNotes();
                setIsEditing(false);
                setSelectedNote(null);
                alert("노트가 수정되었습니다.");
            }
        } catch (err) {
            console.error('노트 수정 오류:', err);
            alert(err.response?.data?.message || "노트 수정에 실패했습니다.");
        }
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
                        <p className="side-name">{userData.username}</p>
                        <p className="side-email">{userData.email}</p>
                        <ul className="side-menu">
                            <li onClick={() => navigate('/myPage')}>My Page</li>
                            <li onClick={() => navigate('/savedQ')}>Saved Questions</li>
                            <li onClick={() => navigate('/savedLink')}>Saved Link</li>
                            <li onClick={() => navigate('/note')}>Note</li>
                            <li onClick={() => navigate('/')}>Log Out</li>
                        </ul>
                    </div>
                )}

                <div className="note-main">
                    <div className="note-title-wrapper">
                        <h2 className="note-title">NOTE</h2>
                        <button className="add-note-button" onClick={() => setIsCreating(true)}>+</button>
                    </div>

                    {isCreating && (
                        <div className="note-editor">
                            <input
                                type="text"
                                placeholder="Note Title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                            />
                            <textarea
                                placeholder="Write your note here (Markdown supported)"
                                value={newNote.content}
                                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                            />
                            <button onClick={handleCreateNote}>Save Note</button>
                            <button onClick={() => setIsCreating(false)}>Cancel</button>
                        </div>
                    )}

                    <div className={isGridView ? "note-grid" : "note-list"}>
                        {notes.map((note) => (
                            <div 
                                className="note-card" 
                                key={note._id}
                                onClick={() => handleNoteClick(note)}
                            >
                                <h3>{note.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* 노트 상세보기 모달 */}
                    {selectedNote && (
                        <div className="note-modal">
                            <div className="note-modal-content">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedNote.title}
                                            onChange={(e) => setEditedNote({
                                                ...editedNote,
                                                title: e.target.value
                                            })}
                                        />
                                        <textarea
                                            value={editedNote.content}
                                            onChange={(e) => setEditedNote({
                                                ...editedNote,
                                                content: e.target.value
                                            })}
                                        />
                                        <div className="modal-buttons">
                                            <button onClick={handleEditNote}>Save</button>
                                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2>{selectedNote.title}</h2>
                                        <div className="note-content-full">
                                            <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                                        </div>
                                        <div className="modal-buttons">
                                            <button onClick={() => setIsEditing(true)}>Edit</button>
                                            <button onClick={() => setSelectedNote(null)}>Close</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Note;
