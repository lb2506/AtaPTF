import React from 'react';
import './CornerTexts.css';

const CornerTexts = ({ project }) => {

    const cssVars = {
        '--color2': project ? project.color2 : "#FFFFFF"
    };

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
                    <li>CANVAS</li>
                    <li>CATEGORY</li>
                    <li>CONTACT</li>
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