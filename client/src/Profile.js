import React from "react";
import "./Profile.css";

const Profile = ({ user }) => {
    if (!user) return <div className="user-profile-container">로그인이 필요합니다.</div>;

    return (
        <div className="user-profile-container">
        <div className="side-card">
            <div className="profile-circle-large" />
            <p className="side-name">{user.name} &gt;</p>
            <p className="side-email">{user.email}</p>
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
            <span className="highlight">{user.name}</span>
            </p>
            <p>
            <strong>E-Mail</strong>
            <br />
            <span className="highlight">{user.email}</span>
            </p>
            <p>
            <strong>Password</strong>
            <br />-
            </p>
            <p>
            <strong>My interests</strong>
            <br />
            <span className="tags">
                {user.interests?.map((tag, i) => `#${tag}${i < user.interests.length - 1 ? " " : ""}`)}
            </span>
            </p>
        </div>
        </div>
    );
};

export default Profile;
