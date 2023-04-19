import React from 'react';
import './CornerTexts.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CornerTexts = ({ project }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const cssVars = {
        '--color2': project ? project.color2 : "#FFFFFF"
    };

    const isHome = location.pathname === "/";
    const isContact = location.pathname === "/contact";

    return (
        <div
            style={{ ...cssVars }}>
            <div className="top-left-text">ATABAK</div>
            <div className="bottom-left-text">
                <span>CREATIVE</span>
                <span>DIRECTOR</span>
            </div>
            <nav className="top-right-menu">
            <ul>
                    <li onClick={() => navigate("/")} className={isHome ? 'bold' : ''}>CANVAS</li>
                    <li>CATEGORY</li>
                    <li onClick={() => navigate("/contact")} className={isContact ? 'bold' : ''}>CONTACT</li>
                </ul>
            </nav>
            <div className="bottom-right-links">
                <span>EMAIL</span>
                <span>INSTAGRAM</span>
                <span>TWITTER</span>
            </div>
        </div>
    );
};

export default React.memo(CornerTexts);