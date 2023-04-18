import React from "react";

const EnlargedImage = ({ enlargedImgData, windowWidth, windowHeight, handleClickOnEnlargedImage, isReturning }) => {
  if (!enlargedImgData) return null;

  const { src, x, y, width, height } = enlargedImgData;

  const centerX = windowWidth / 2 - width / 2;
  const centerY = windowHeight / 2 - height / 2;

  const initX = x - centerX;
  const initY = y - centerY;

  return (
    <div
        style={{
          position: "fixed",
          top: centerY,
          left: centerX,
          width: width,
          height: height,
          zIndex: 999,
          animationName: isReturning ? `move-to-origin-${width && height === 250 ? "small" : "big"}` : `move-to-center-${width && height === 250 ? "small" : "big"}`,
          animationDuration: "0.5s",
          animationFillMode: "forwards",
          animationTimingFunction: "ease-in-out",
          '--init-x': `${initX}px`,
          '--init-y': `${initY}px`,
        }}
      >

        <img
          src={src}
          alt="Enlarged"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />
      </div>
  );
};

export default React.memo(EnlargedImage);