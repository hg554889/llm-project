import React from "react";
import { useNavigate } from 'react-router-dom';
import "./SavedLink.css";

const SavedLink = () => {
     const navigate = useNavigate(); 

    return (
        <div className="savedlink-container">
        <header className="savedlink-header">
            <div className="menu-toggle">☰</div>
            <h1>Code Programming Runner</h1>
            <div className="profile-dot"></div>
        </header>

        <div className="savedlink-content">
            <div className="savedlink-sidebar">
            <div className="profile-circle-large" />
            <p className="side-name">Aurora &gt;</p>
            <p className="side-email">gudeg0702@gmail.com</p>
            <ul className="side-menu">
                <li onClick={()=>navigate('/myPage')}>My Page</li>
                <li onClick={()=>navigate('/savedQ')}>Saved Questions</li>
                <li onClick={()=>navigate('/savedLink')}>Saved Link</li>
                <li>Note</li>
                <li onClick={()=>navigate('/')}>Log Out</li>
            </ul>
            </div>

            <div className="savedlink-main">
            <h2 className="savedlink-title">Saved Link</h2>
            <div className="link-item">
                <strong>Exemple.com</strong>
                <hr />
            </div>
            {/* 링크 아이템을 더 추가할 수 있어요 */}
            </div>
        </div>
        </div>
    );
};

export default SavedLink;
