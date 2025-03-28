import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css"; // 스타일은 아래 CSS 참고

const Main = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="main-box">
        <h1 className="main-title">Code Programming Runner</h1>
        <p className="main-description">
          This is a service for programming language learners, <br />
          and it can accommodate everyone from beginners to development job seekers. <br />
          Hurry up and try it and check your skills as it improves!
        </p>
        <button className="main-button" onClick={handleStartClick}>
          Go to Start &gt;
        </button>
      </div>
    </div>
  );
};

export default Main;
