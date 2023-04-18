import React from 'react';
import './CornerTexts.css';

const CornerTexts = ({project}) => {

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
      <div className="top-right-menu">
        <span>CANVAS</span>
        <span>CATEGORY</span>
        <span>CONTACT</span>
      </div>
      <div className="bottom-right-links">
        <span>EMAIL</span>
        <span>INSTAGRAM</span>
        <span>TWITTER</span>
      </div>
    </div>
  );
};

export default CornerTexts;
