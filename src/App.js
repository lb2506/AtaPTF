import React, { useState, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import "konva/lib/filters/Grayscale";
import "./App.css";

const WIDTH = 250;
const HEIGHT = 250;
const LARGE_WIDTH = 530;
const LARGE_HEIGHT = 530;
const MARGIN = 30;
const GRID_SIZE = 100;

const bigProjects = [6, 11]; // index of projects
const bigProjetsFerequency = 3; // 1 is very frequently

const imageURLs = [
  "https://picsum.photos/id/1/250/250", // 0
  "https://picsum.photos/id/15/250/250", // 1
  "https://picsum.photos/id/26/250/250", // 2
  "https://picsum.photos/id/33/250/250", // 3
  "https://picsum.photos/id/54/250/250", // 4
  "https://picsum.photos/id/63/250/250", // 5
  "https://picsum.photos/id/74/250/250", // 6
  "https://picsum.photos/id/29/250/250", // 7
  "https://picsum.photos/id/7/250/250", // 8
  "https://picsum.photos/id/44/250/250", // 9
  "https://picsum.photos/id/20/250/250", // 10
  "https://picsum.photos/id/39/250/250", // 11
  "https://picsum.photos/id/21/250/250", // 12
  "https://picsum.photos/id/28/250/250", // 13
  "https://picsum.photos/id/9/250/250", // 14
  "https://picsum.photos/id/64/250/250", // 15
];

const generateDeterministicImageIndexGrid = (size) => {
  const rowCoefficient = 3;
  const colCoefficient = 6;
  const modCoefficient = imageURLs.length;

  const grid = Array(size)
    .fill(null)
    .map((_, rowIndex) =>
      Array(size)
        .fill(null)
        .map((_, colIndex) => (rowIndex * rowCoefficient + colIndex * colCoefficient) % modCoefficient)
    );
  return grid;
};


const loadImages = (urls) => {
  return Promise.all(urls.map((url) => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        ctx.globalCompositeOperation = 'saturation';
        ctx.fillStyle = 'hsl(0, 0%, 100%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = 'hsl(0, 0%, 0%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const grayscaleImage = new window.Image();
        grayscaleImage.onload = () => {
          resolve({ color: image, grayscale: grayscaleImage });
        };
        grayscaleImage.src = canvas.toDataURL();
      };
      image.onerror = (err) => reject(err);
      image.src = url;
    });
  }));
};

const ImageGrid = React.memo(({
  x,
  y,
  width,
  height,
  image,
  onMouseEnter,
  onMouseLeave,
  zIndex, // Ajoutez ceci
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
      zIndex={zIndex} // Ajoutez ceci
    />
  );
});


const App = () => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [images, setImages] = useState([]);
  const [imagesGrayscale, setImagesGrayscale] = useState([]);
  const [randomImageIndexGrid] = useState(generateDeterministicImageIndexGrid(GRID_SIZE));
  const [hoveredImageIndices, setHoveredImageIndices] = useState({});

  useEffect(() => {
    loadImages(imageURLs).then((loadedImages) => {
      setImages(loadedImages.map(img => img.color));
      setImagesGrayscale(loadedImages.map(img => img.grayscale));
    });
  }, []);

  const startX = Math.floor((-stagePos.x - window.innerWidth) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);
  const endX = Math.floor((-stagePos.x + window.innerWidth * 2) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);

  const startY = Math.floor((-stagePos.y - window.innerHeight) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);
  const endY = Math.floor((-stagePos.y + window.innerHeight * 2) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);

  const handleMouseEnter = useCallback((x, y) => {
    setHoveredImageIndices((prevHoveredIndices) => {
      return { ...prevHoveredIndices, [`${x}-${y}`]: true };
    });
  }, []);

  const handleMouseLeave = useCallback((x, y) => {
    setHoveredImageIndices((prevHoveredIndices) => {
      const newHoveredIndices = { ...prevHoveredIndices };
      delete newHoveredIndices[`${x}-${y}`];
      return newHoveredIndices;
    });
  }, []);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();

    const newStagePos = {
      x: stagePos.x - e.evt.deltaX,
      y: stagePos.y - e.evt.deltaY,
    };

    setStagePos(newStagePos);
  }, [stagePos]);

  const shouldEnlargeFirstImage = (x, y, imageIndex) => {
    return bigProjects.includes(imageIndex) && (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0;
  };

  const getZIndex = (x, y, imageIndex) => {
    const isEnlarged = bigProjects.includes(imageIndex) && (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0;
    return isEnlarged ? 1 : 0;
  };



  const renderGridComponents = () => {
    const gridComponents = [];
    for (let x = startX; x < endX; x += WIDTH + MARGIN) {
      for (let y = startY; y < endY; y += HEIGHT + MARGIN) {
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
          zIndex: getZIndex(x, y, imageIndex),
        });
      }
    }

    // Trier les composants d'image par zIndex
    gridComponents.sort((a, b) => a.zIndex - b.zIndex);

    // Rendre les composants d'image triés
    return gridComponents.map(({ x, y, width, height, image, onMouseEnter, onMouseLeave, zIndex }) => ( // Ajoutez "zIndex" ici
      <ImageGrid
        key={`${x}-${y}`}
        x={x}
        y={y}
        width={width}
        height={height}
        image={image}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        zIndex={zIndex} // Ajoutez ceci
      />
    ));
  };


  return (
    <Stage
      x={stagePos.x}
      y={stagePos.y}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onWheel={handleWheel}
      onDragEnd={(e) => {
        setStagePos(e.currentTarget.position());
      }}
    >
      <Layer>{renderGridComponents()}</Layer>
    </Stage>
  );
};

export default App;