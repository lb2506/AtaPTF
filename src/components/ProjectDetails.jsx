import React, { useState, useEffect } from 'react';
import './ProjectDetails.css';

const ProjectDetails = ({ showDetails, project, onDetailsClose, handleClickOnEnlargedImage }) => {
  const [centerImage, setCenterImage] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    if (showDetails) {
      const timer = setTimeout(() => {
        setCenterImage(false);
      }, 500);

      const animationTimer = setTimeout(() => {
        setAnimationFinished(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(animationTimer);
      };
    }
  }, [showDetails]);

  const handleClick = () => {
    setAnimationFinished(false);
    const timer = setTimeout(() => {
      setCenterImage(true);
    }, 500);

    const closeDelay = setTimeout(() => {
      onDetailsClose();
    }, 1000);

    const closeDetails = setTimeout(() => {
      handleClickOnEnlargedImage()
    }, 1500)
    
    return () => {
      clearTimeout(timer);
      clearTimeout(closeDelay);
      clearTimeout(closeDetails)
    };
  };

  if (!showDetails || !project) return null;

  return (
    <div className="project-details">
      <div className="details-container">
        <img
          src={project.imageURL}
          alt='project'
          onClick={handleClick}
          className={`project-image ${animationFinished ? 'static' : ''} ${centerImage ? 'center' : 'left'}`}
        />
        <div
          className="project-text"
          style={{
            display: animationFinished ? 'block' : 'none',
          }}
        >
          <div className={`project-text-content ${animationFinished ? 'fadeIn' : ''}`}>
            <h1 className="title">TITLE</h1>
            <div>
              <h1 className="specifications">Specifications</h1>
              <ul>
                <li>
                  <span>COMPLETED</span>
                  <span>March 2023</span>
                </li>
                <li>
                  <span>TYPE</span>
                  <span>Brand Identity</span>
                </li>
                <li>
                  <span>ROLE</span>
                  <span>Creztive Director</span>
                </li>
                <li>
                  <span>CLIENT</span>
                  <span>Sneakmart.</span>
                </li>
                <li>
                  <span>DESCRIPTION</span>
                  <span>Artwork projection for the Denver Theatre District displayed on the Daniels & Ficher Tower, a historic landmark in Denver, Colorado.</span>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
