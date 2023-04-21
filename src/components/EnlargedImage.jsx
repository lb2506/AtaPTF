import React from "react";

const EnlargedImage = ({ enlargedImgData, windowWidth, windowHeight, handleClickOnEnlargedImage, isReturning }) => {
  if (!enlargedImgData) return null;

  const { src, x, y, width, height } = enlargedImgData;

  const centerX = windowWidth / 2 - width / 2;
  const centerY = windowHeight / 2 - height / 2;

  const initX = x - centerX;
  const initY = y - centerY;

  const imageSize = width && height === 250 ? "small" : "big";
  const animationName = isReturning ? `move-to-origin-${imageSize}` : `move-to-center-${imageSize}`;

  const containerStyle = {
    position: "fixed",
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
    <div style={containerStyle}>
      <img src={src} alt="Enlarged" style={imgStyle} />
    </div>
  );
};

export default React.memo(EnlargedImage);