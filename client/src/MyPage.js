import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainlogo from './img/mainlogo.png'; // 이미지 파일 추가
import "./MyPage.css"; // CSS 분리

const Mypage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // React Router를 사용한 페이지 이동

    // 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="profile-wrapper" ref={dropdownRef}>
        <div className="profile-icon" onClick={toggleDropdown} />

        {isOpen && (
            <div className="profile-dropdown">
            <div className="profile-header">
                <div className="profile-circle" />
                <div className="profile-info">
                <p className="profile-name">Aurora &gt;</p>
                <p className="profile-email">gudeg0702@gmail.com</p>
                </div>
            </div>

            <ul className="profile-menu">
                <li onClick={() => navigate('./myPage')}>My Page</li>
                <li onClick={() => navigate('./savedQ')}>Saved Questions</li>
                <li onClick={() => navigate('./savedLink')}>Saved Links</li>
                <li>Customer Service</li>
                <li>Log out</li>
            </ul>
            </div>
        )}
        </div>
    );
};

export default Mypage;
