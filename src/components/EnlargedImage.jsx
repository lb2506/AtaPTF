import React, { useEffect, useState, useCallback } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

const EnlargedImage = ({ enlargedImgData, isReturning }) => {
  const [isMobile, setIsMobile] = useState(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const checkIsMobile = useCallback(() => {
    if (window.innerWidth <= 768) {
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
  
  if (!enlargedImgData) return null;

  const { src, x, y, width, height } = enlargedImgData;

  const centerX = windowWidth / 2 - width / 2;
  const centerY = windowHeight / 2 - height / 2;

  const initX = x - centerX;
  const initY = y - centerY;

  const imageSize = width && height === 250 ? "small" : "big";
  const animationName = isReturning ? `move-to-origin-${imageSize}${isMobile ? '-mobile' : ''}` : `move-to-center-${imageSize}${isMobile ? '-mobile' : ''}`;

  const containerStyle = {
    position: "fixed",
    willChange: 'transform',
    top: centerY,
    left: centerX,
    width: width,
    height: height,
    zIndex: 999,
    animationName: animationName,
    animationDuration: "0.5s",
    animationFillMode: "forwards",
    animationTimingFunction: "ease-in-out",
    '--init-x': `${initX}px`,
    '--init-y': `${initY}px`,
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  };

  return (
    <div className="container-enlarged" style={containerStyle}>
      <img src={src} alt="Enlarged" style={imgStyle} />
    </div>
  );
};

export default React.memo(EnlargedImage);
