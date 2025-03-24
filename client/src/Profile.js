import React from "react";
import "./UserProfile.css";

const UserProfile = () => {
    return (
        <div className="user-profile-container">
        <div className="side-card">
            <div className="profile-circle-large" />
            <p className="side-name">Aurora &gt;</p>
            <p className="side-email">gudeg0702@gmail.com</p>
            <ul className="side-menu">
            <li>My Page</li>
            <li>Saved Questions</li>
            <li>Saved Links</li>
            <li>Customer Service</li>
            </ul>
        </div>

        <div className="main-card">
            <p>
            <strong>ID</strong>
            <br />
            <span className="highlight">Aurora</span>
            </p>
            <p>
            <strong>E-Mail</strong>
            <br />
            <span className="highlight">gudeg0702@gmail.com</span>
            </p>
            <p>
            <strong>Password</strong>
            <br />-
            </p>
            <p>
            <strong>My interests</strong>
            <br />
            <span className="tags">#Python #C/C++ #Algorithm ...</span>
            </p>
        </div>
        </div>
    );
};

export default UserProfile;
