import React from "react";
import ImageGrid from "./ImageGrid";

const ImageGridComponent = ({
  startX,
  endX,
  startY,
  endY,
  hoveredImageIndices,
  images,
  imagesGrayscale,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
  randomImageIndexGrid,
  hiddenImage,
  isUnderLargeImage,
  WIDTH,
  HEIGHT,
  MARGIN,
  GRID_SIZE,
  bigProjetsFerequency,
  LARGE_HEIGHT,
  LARGE_WIDTH,
  shouldEnlargeFirstImage
}) => {
  const gridComponents = [];

  for (let x = startX; x < endX; x += WIDTH + MARGIN) {
    for (let y = startY; y < endY; y += HEIGHT + MARGIN) {
      if (!isUnderLargeImage(x, y, GRID_SIZE, bigProjetsFerequency)) {
        const indexX = Math.abs(x / (WIDTH + MARGIN)) % GRID_SIZE;
        const indexY = Math.abs(y / (HEIGHT + MARGIN)) % GRID_SIZE;

        const imageIndex = randomImageIndexGrid[indexX][indexY];

        const isHovered = hoveredImageIndices[`${x}-${y}`] === true;

        const isEnlarged = shouldEnlargeFirstImage(x, y, imageIndex);

        gridComponents.push({
          x,
          y,
          width: isEnlarged ? LARGE_WIDTH : WIDTH,
          height: isEnlarged ? LARGE_HEIGHT : HEIGHT,
          image: isHovered ? images[imageIndex] : imagesGrayscale[imageIndex],
          onMouseEnter: () => handleMouseEnter(x, y),
          onMouseLeave: () => handleMouseLeave(x, y),
        });
      }
    }
  }

  gridComponents.sort((a, b) => {
    if (a.width > b.width) return 1;
    if (a.width < b.width) return -1;
    return 0;
  });

  return gridComponents.map(
    ({ x, y, width, height, image, onMouseEnter, onMouseLeave, onClick }) => {
      if (hiddenImage && hiddenImage.x === x && hiddenImage.y === y) {
        return null;
      }

      return (
        <ImageGrid
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={width}
          height={height}
          image={image}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={() => handleClick(x, y)}
        />
      );
    }
  );
};

export default React.memo(ImageGridComponent);