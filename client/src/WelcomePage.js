import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate("/login");
    };

    return (
        <div className="welcome-container">
        <div className="welcome-box">
            <h1 className="welcome-title">Code Programming Runner</h1>
            <p className="welcome-description">
            This is a service for programming language learners, <br />
            and it can accommodate everyone from beginners to development job seekers. <br />
            Hurry up and try it and check your skills as it improves!
            </p>
            <button className="start-button" onClick={handleStartClick}>
            Go to Start &gt;
            </button>
        </div>
        </div>
    );
};

export default WelcomePage;
