import React from "react";
import { useNavigate } from 'react-router-dom';
import mainlogo from './img/mainlogo.png'; 
import "./SavedLink.css";

const SavedLink = () => {
     const navigate = useNavigate(); 

    return (
        <div className="savedlink-container">
         <div className="header">
                          <div className='left-section'>
                          <i className="fa-sharp fa-solid fa-bars"></i>
                           <img src={mainlogo} alt='logo' />
                          <h1 >CPR</h1>
                          </div>
                
                          <h1 onClick={() => navigate('')}>Code Programming Runner</h1> {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                        
                          <div className='right-section'>
                          <i className="fa-solid fa-user" onClick={() => navigate('')}></i>  
                          {/* 페이지 어디로 옮겨야 되는지 모르겠음 */}
                          <i class="fa-solid fa-layer-group" onClick={() => navigate('/envir')}></i>
                          </div>
                        </div>

        <div className="savedlink-content">
            <div className="savedlink-sidebar">
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
