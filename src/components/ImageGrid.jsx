import React from "react";
import { Image as KonvaImage } from "react-konva";

const ImageGrid = React.memo(({
  x,
  y,
  width,
  height,
  image,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <KonvaImage
      x={x}
      y={y}
      width={width}
      height={height}
      image={image}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
});

export default ImageGrid;
