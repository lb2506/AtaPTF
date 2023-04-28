import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ProjectDetails.css';

const ProjectDetails = ({ showDetails, project, onDetailsClose, handleClickOnEnlargedImage }) => {
  const [centerImage, setCenterImage] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [closing, setClosing] = useState(false);

  const checkIsMobile = useCallback(() => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [checkIsMobile]);


  useEffect(() => {
    let timer = null;
    let animationTimer = null;

    if (showDetails) {
      timer = setTimeout(() => {
        setCenterImage(false);
      }, 500);

      animationTimer = setTimeout(() => {
        setAnimationFinished(true);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, [showDetails]);


  const handleClick = useCallback(() => {
    setClosing(true);
    setAnimationFinished(false);

    const timer = setTimeout(() => {
      setCenterImage(true);
    }, 500);

    const closeDelay = setTimeout(() => {
      onDetailsClose();
    }, 1000);

    const closeDetails = setTimeout(() => {
      handleClickOnEnlargedImage();
      setClosing(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeDelay);
      clearTimeout(closeDetails);

    };
  }, [onDetailsClose, handleClickOnEnlargedImage]);

  const cssVars = useMemo(() => {
    if (!showDetails || !project) return null;
    return {
      '--color1': project.color1,
      '--color2': project.color2,
      '--innerHeight': `${window.innerHeight}px`,
    };
  }, [showDetails, project]);

  if (!showDetails || !project) return null;

  return (
    <div
      style={{ ...cssVars }}
      className="project-details">
      <div
        className="close-button"
        style={{ display: animationFinished ? "block" : "none" }}
        onClick={handleClick}
      />
      <div className={`details-container-top ${isMobile && !centerImage ? "move-to-top" : "move-to-bottom"}`}>
        <img
          src={project.imageColor}
          alt='project'
          className={`project-image ${centerImage && !isMobile ? 'center' : 'left'}`}
        />
        <div
          className="project-text"
          style={!isMobile ? { display: animationFinished ? 'block' : 'none' } : null}
        >
          <div className={`project-text-content ${animationFinished ? 'fadeIn' : closing ? "fadeOut" : ""}`}>
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
      <div
        className={`details-container-bottom ${animationFinished ? "fadeInDesc" : closing ? "fadeOutDesc" : ""
          }`}
      >
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
