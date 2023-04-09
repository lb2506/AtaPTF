import React, { useState, useEffect } from 'react';

const ProjectDetails = ({ showDetails, project }) => {
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

  if (!showDetails || !project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{
        width: "80%",
        backgroundColor: "rgba(255,255,255, 0.1",
        display: "flex ",
        alignItems: 'center',
        position: 'relative',
      }}>
        <img
          src={project.imageURL}
          alt='project'
          style={{
            width: "530px",
            height: "530px",
            position: animationFinished ? 'static' : 'absolute',
            top: animationFinished ? undefined : '50%',
            left: animationFinished ? undefined : (centerImage ? '50%' : '0%'),
            transform: animationFinished ? undefined : (centerImage ? 'translate(-50%, -50%)' : 'translate(0, -50%)'),
            transition: centerImage || !animationFinished ? 'left 0.5s ease, transform 0.5s ease' : undefined,
          }}
        />
        <div
          style={{
            display: animationFinished ? 'block' : 'none',
            width: '100%',
            height: '530px',
            marginLeft: '5%'
          }}
        >
          <div
          style={{
            display:'flex',
            flexDirection:'column',
            justifyContent:'space-between',
            height:'100%'
          }}>
            <h1
              style={{
                color: 'white',
                fontSize: '50px'
              }}
            >TITRE</h1>
            <div>
              <h1
                style={{
                  color: 'white',
                  fontSize: '35px'
                }}
              >
                Spécifications
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
