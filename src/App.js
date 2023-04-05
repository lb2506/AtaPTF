import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import "konva/lib/filters/Grayscale";
import "./App.css";
import "./animations.css";


const WIDTH = 250;
const HEIGHT = 250;
const LARGE_WIDTH = 530;
const LARGE_HEIGHT = 530;
const MARGIN = 30;
const GRID_SIZE = 100;

const bigProjects = [0, 6, 11];
const bigProjetsFerequency = 3;

const imageURLs = [
  "/assets/0.jpg", // 0
  "/assets/1.jpg", // 1
  "/assets/2.jpg", // 2
  "/assets/3.jpg", // 3
  "/assets/4.jpg", // 4
  "/assets/5.jpg", // 5
  "/assets/6.jpg", // 6
  "/assets/7.jpg", // 7
  "/assets/8.jpg", // 8
  "/assets/9.jpg", // 9
  "/assets/10.jpg", // 10
  "/assets/11.jpg", // 11
  "/assets/12.jpg", // 12
  "/assets/13.jpg", // 13
  "/assets/14.jpg", // 14
  "/assets/15.jpg", // 15
];

const generateDeterministicImageIndexGrid = (size) => {
  const rowCoefficient = 6;
  const colCoefficient = 7;
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

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const App = () => {
  const [stagePos, setStagePos] = useState({ x: -50, y: 0 });
  const [images, setImages] = useState([]);
  const [imagesGrayscale, setImagesGrayscale] = useState([]);
  const [randomImageIndexGrid] = useState(generateDeterministicImageIndexGrid(GRID_SIZE));
  const [hoveredImageIndices, setHoveredImageIndices] = useState({});
  const [enlargedImgData, setEnlargedImgData] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    loadImages(imageURLs).then((loadedImages) => {
      setImages(loadedImages.map(img => img.color));
      setImagesGrayscale(loadedImages.map(img => img.grayscale));
    });
  }, []);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const startX = Math.floor((-stagePos.x - windowWidth) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);
  const endX = Math.floor((-stagePos.x + windowWidth * 2) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);

  const startY = Math.floor((-stagePos.y - windowHeight) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);
  const endY = Math.floor((-stagePos.y + windowHeight * 2) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);

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

  const handleWheel = useCallback(
    (e) => {
      e.evt.preventDefault();

      const updatePosition = () => {
        const newStagePos = {
          x: stagePos.x - e.evt.deltaX,
          y: stagePos.y - e.evt.deltaY,
        };

        setStagePos(newStagePos);
      };

      requestAnimationFrame(updatePosition);
    },
    [stagePos]
  );

  const shouldEnlargeFirstImage = (x, y, imageIndex) => {
    return bigProjects.includes(imageIndex) && (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0;
  };

  const handleClick = useCallback((x, y) => {
    const indexX = Math.abs(x / (WIDTH + MARGIN)) % GRID_SIZE;
    const indexY = Math.abs(y / (HEIGHT + MARGIN)) % GRID_SIZE;
    const imageIndex = randomImageIndexGrid[indexX][indexY];
    const isEnlarged = shouldEnlargeFirstImage(x, y, imageIndex);

    const imgWidth = isEnlarged ? LARGE_WIDTH : WIDTH;
    const imgHeight = isEnlarged ? LARGE_HEIGHT : HEIGHT;

    setEnlargedImgData({
      src: images[imageIndex].src,
      x: x + stagePos.x,
      y: y + stagePos.y,
      width: imgWidth,
      height: imgHeight,
    });
  }, [randomImageIndexGrid, images, stagePos]);

  const renderGridComponents = useMemo(() => {
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
        });
      }
    }

    gridComponents.sort((a, b) => {
      if (a.width > b.width) return 1;
      if (a.width < b.width) return -1;
      return 0;
    });

    return gridComponents.map(({ x, y, width, height, image, onMouseEnter, onMouseLeave, onClick }) => (
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
    ));
  }, [startX, endX, startY, endY, hoveredImageIndices, images, imagesGrayscale, handleMouseEnter, handleMouseLeave, handleClick, randomImageIndexGrid]);

  const EnlargedImageComponent = useMemo(() => {
    if (!enlargedImgData) return null;
  
    const { src, x, y, width, height } = enlargedImgData;
  
    const centerX = windowWidth / 2 - width / 2;
    const centerY = windowHeight / 2 - height / 2;
  
    const initX = x - centerX;
    const initY = y - centerY;
  
    const handleClickOnEnlargedImage = () => {
      setIsReturning(true);
      setTimeout(() => {
        setEnlargedImgData(null);
        setIsReturning(false);
      }, 1000);
    };
  
    return (
      <div
        onClick={handleClickOnEnlargedImage}
        style={{
          position: "fixed",
          top: centerY,
          left: centerX,
          width: width,
          height: height,
          zIndex: 1000,
          animation: isReturning ? "move-to-origin 1s forwards" : "move-to-center 1s forwards",
          animationTimingFunction: "ease-out",
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
  }, [enlargedImgData, windowWidth, windowHeight, isReturning]);

  return (
    <>
      <Stage
        x={stagePos.x}
        y={stagePos.y}
        width={windowWidth}
        height={windowHeight}
        draggable
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setStagePos(e.currentTarget.position());
        }}
      >
        <Layer>{renderGridComponents}</Layer>
      </Stage>
      {EnlargedImageComponent}
    </>
  );
};

export default App;