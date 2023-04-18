import React from "react";
import "../animations.css"

const BlackBackground = ({
  showBlackBackground,
  isFadingOut,
  handleClickOnEnlargedImage,
  project
}) => {
  if (!showBlackBackground && !isFadingOut) return null;

  const animationClass = isFadingOut ? "fadeOut" : "fadeIn";

  return (
    <div
      onClick={handleClickOnEnlargedImage}
      className={animationClass}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: project ? project.color1 : null,
        zIndex: 998,
        animationDuration: "0.5s",
      }}
    />
  );
};

export default BlackBackground;