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
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/0_sksnpj.jpg", // 0
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/1_bh663m.jpg", // 1
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/2_jf5xgp.jpg", // 2
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/3_d4sn5r.jpg", // 3
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/4_oqrqba.jpg", // 4
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/5_ei2bme.jpg", // 5
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/6_umckuq.jpg", // 6
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/7_robbgj.jpg", // 7
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798737/PorteFolio%20Atabak/8_ltzp3n.jpg", // 8
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/9_p7vjt4.jpg", // 9
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/10_f6t8op.jpg", // 10
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/11_pbb9e2.jpg", // 11
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/12_vugunh.jpg", // 12
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/13_zuqlhd.jpg", // 13
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/14_dponuc.jpg", // 14
  "https://res.cloudinary.com/dslilw3b5/image/upload/v1680798738/PorteFolio%20Atabak/15_fet1if.jpg", // 15
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
  const [showBlackBackground, setShowBlackBackground] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hiddenImage, setHiddenImage] = useState(null);


  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        setShowBlackBackground(false);
        setIsFadingOut(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);



  useEffect(() => {
    loadImages(imageURLs).then((loadedImages) => {
      setImages(loadedImages.map(img => img.color));
      setImagesGrayscale(loadedImages.map(img => img.grayscale));
    });
  }, []);

  const isUnderLargeImage = useCallback((x, y, gridSize, bigProjetsFerequency) => {
    const checkPosition = (x, y) => {
      const indexX = Math.abs(x / (WIDTH + MARGIN)) % gridSize;
      const indexY = Math.abs(y / (HEIGHT + MARGIN)) % gridSize;
  
      const imageIndex = randomImageIndexGrid[indexX][indexY];
      return bigProjects.includes(imageIndex) && (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0;
    };
  
    const left = checkPosition(x - (WIDTH + MARGIN), y);
    const top = checkPosition(x, y - (HEIGHT + MARGIN));
    const topLeft = checkPosition(x - (WIDTH + MARGIN), y - (HEIGHT + MARGIN));
  
    return left || top || topLeft;
  }, [randomImageIndexGrid]);
  

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

  const handleClickOnEnlargedImage = () => {
    setIsReturning(true);
    setTimeout(() => {
      handleMouseLeave(hiddenImage.x, hiddenImage.y); // Ajouté cette ligne
      setHiddenImage(null);
      setEnlargedImgData(null);
      setIsReturning(false);
    }, 500);
    setIsFadingOut(true);
  };
  


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

    setHiddenImage({ x, y, imageIndex });
    setShowBlackBackground(true);
  }, [randomImageIndexGrid, images, stagePos]);



  const renderGridComponents = useMemo(() => {
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



    return gridComponents.map(({ x, y, width, height, image, onMouseEnter, onMouseLeave, onClick }) => {
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
    });
}, [startX, endX, startY, endY, hoveredImageIndices, images, imagesGrayscale, handleMouseEnter, handleMouseLeave, handleClick, randomImageIndexGrid, hiddenImage, isUnderLargeImage]);

  const EnlargedImageComponent = useMemo(() => {
    if (!enlargedImgData) return null;

    const { src, x, y, width, height } = enlargedImgData;

    const centerX = windowWidth / 2 - width / 2;
    const centerY = windowHeight / 2 - height / 2;

    const initX = x - centerX;
    const initY = y - centerY;


    return (

      <div
        // onClick={handleClickOnEnlargedImage}
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
  }, [enlargedImgData, windowWidth, windowHeight, isReturning]);

  const BlackBackground = useMemo(() => {
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
          backgroundColor: "rgba(0, 0, 0, 1)",
          zIndex: 998,
          animationDuration: "0.5s",
        }}
      />
    );
  }, [showBlackBackground, isFadingOut]);






  return (
    <>
      <Stage
        className="container"
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
      {BlackBackground}
    </>
  );
};

export default App;