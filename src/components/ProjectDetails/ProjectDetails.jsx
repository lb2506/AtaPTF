import React, { useState, useEffect, useCallback } from 'react';
import './ProjectDetails.css';

const ProjectDetails = ({ showDetails, project, onDetailsClose, handleClickOnEnlargedImage }) => {
  const [centerImage, setCenterImage] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(null);
  const [animationFinishedFirstTime, setAnimationFinishedFirstTime] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);


  useEffect(() => {

    let timer, animationTimer;

    if (showDetails) {
      timer = setTimeout(() => {
        setCenterImage(false);
      }, 500);

      animationTimer = setTimeout(() => {
        setAnimationFinished(true);
        setAnimationFinishedFirstTime(true);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, [showDetails]);

  const handleClick = useCallback(() => {
    setAnimationFinished(false);

    if (isMobile) {
      setCenterImage(true)
      onDetailsClose();

      const closeDetails = setTimeout(() => {
        handleClickOnEnlargedImage();
        setAnimationFinishedFirstTime(null);
      }, 500);

      return () => {
        clearTimeout(closeDetails);
      };

    } else {

      const timer = setTimeout(() => {
        setCenterImage(true);
      }, 500);

      const closeDelay = setTimeout(() => {
        onDetailsClose();
      }, 1000);

      const closeDetails = setTimeout(() => {
        handleClickOnEnlargedImage();
        setAnimationFinishedFirstTime(null);
      }, 1500);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeDelay);
        clearTimeout(closeDetails);
      };
    }
  }, [onDetailsClose, handleClickOnEnlargedImage, isMobile]);

  if (!showDetails || !project) return null;

  const cssVars = {
    '--color1': project.color1,
    '--color2': project.color2,
  };

  return (
    <div
      style={{ ...cssVars }}
      className="project-details">
      <div className="details-container-top">
        <img
          src={project.imageColor}
          alt='project'
          onClick={handleClick}

          className={`project-image ${animationFinished ? 'static' : ''} ${centerImage ? 'center' : 'left'}`}
        />
        <div
          className="project-text"
          style={{
            display: animationFinished || isMobile ? 'block' : 'none',
          }}
        >

          <div className={`project-text-content ${animationFinished || isMobile ? 'fadeIn' : ''}`}>
            <h1 className="title">{project.title}</h1>
            <div>
              <h1 className="specifications">Specifications</h1>
              <ul>
                <li>
                  <span>COMPLETED</span>
                  <span>{project.completed}</span>
                </li>
                <li>
                  <span>TYPE</span>
                  <span>{project.type}</span>
                </li>
                <li>
                  <span>ROLE</span>
                  <span>{project.role}</span>
                </li>
                <li>
                  <span>CLIENT</span>
                  <span>{project.client}</span>
                </li>
                <li>
                  <span>DESCRIPTION</span>
                  <span>{project.description}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={`details-container-bottom ${isMobile ? 'fadeInDesc' : animationFinished && animationFinishedFirstTime ? 'fadeInDesc' : 'fadeOutDesc'}`}>
        {project.mainImageBottom &&
          <img
            className='project-image-main'
            src={project.mainImageBottom}
            alt='img'
          />
        }
        {project.firstDescription &&
          <p className="details-container-bottom-desc-one">{project.firstDescription}</p>
        }
        <div className='details-container-bottom-pictures'>
          {project.imagesBottom && project.imagesBottom.map((url, index) =>
            <img className="project-image-bottom"
              key={index}
              src={url}
              alt='img'
            />
          )}
          {project.secondeDescription &&
            <div className="details-container-bottom-desc-two">
              <p>{project.secondeDescription}</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectDetails);
