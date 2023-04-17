import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Stage, Layer } from "react-konva";
import "konva/lib/filters/Grayscale";
import "./App.css";
import "./animations.css";

import EnlargedImage from "./components/EnlargedImage";
import ImageGridComponent from './components/ImageGridComponent';
import BlackBackground from "./components/BlackBackground";
import { useWindowSize } from './hooks/useWindowSize';
import { useLoadedImages } from './hooks/useLoadedImages';
import ProjectDetails from './components/ProjectDetails';
import projects from './projects.json';

const WIDTH = 250;
const HEIGHT = 250;
const LARGE_WIDTH = 514;
const LARGE_HEIGHT = 514;
const MARGIN = 16;
const GRID_SIZE = 100;

const bigProjects = [0, 6, 11];
const bigProjetsFerequency = 3;

const imageURLs = projects.map((project) => project.imageURL);

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

const App = () => {
  const [stagePos, setStagePos] = useState({ x: -50, y: 0 });
  const [randomImageIndexGrid] = useState(generateDeterministicImageIndexGrid(GRID_SIZE));
  const [hoveredImageIndices, setHoveredImageIndices] = useState({});
  const [enlargedImgData, setEnlargedImgData] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [showBlackBackground, setShowBlackBackground] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hiddenImage, setHiddenImage] = useState(null);
  const { images, imagesGrayscale } = useLoadedImages(imageURLs);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        setShowBlackBackground(false);
        setIsFadingOut(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);

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
      handleMouseLeave(hiddenImage.x, hiddenImage.y);
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
    setSelectedProject(projects[imageIndex]);
    setTimeout(() => {
      setShowProjectDetails(true);
    }, 500)
  }, [randomImageIndexGrid, images, stagePos]);

  const EnlargedImageComponent = useMemo(() => {
    if (!enlargedImgData) return null;

    return (
      <EnlargedImage
        enlargedImgData={enlargedImgData}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        isReturning={isReturning}
      />
    );
  }, [enlargedImgData, windowWidth, windowHeight, isReturning]);

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
        <Layer>
          <ImageGridComponent
            startX={startX}
            endX={endX}
            startY={startY}
            endY={endY}
            hoveredImageIndices={hoveredImageIndices}
            images={images}
            imagesGrayscale={imagesGrayscale}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleClick={handleClick}
            randomImageIndexGrid={randomImageIndexGrid}
            hiddenImage={hiddenImage}
            isUnderLargeImage={isUnderLargeImage}
            WIDTH={WIDTH}
            HEIGHT={HEIGHT}
            MARGIN={MARGIN}
            GRID_SIZE={GRID_SIZE}
            bigProjetsFerequency={bigProjetsFerequency}
            LARGE_HEIGHT={LARGE_HEIGHT}
            LARGE_WIDTH={LARGE_WIDTH}
            shouldEnlargeFirstImage={shouldEnlargeFirstImage}
          />
        </Layer>
      </Stage>
      <ProjectDetails
        showDetails={showProjectDetails}
        project={selectedProject}
        handleClickOnEnlargedImage={handleClickOnEnlargedImage}
        onDetailsClose={() => setShowProjectDetails(false)}
      />
      {EnlargedImageComponent}
      <BlackBackground
        showBlackBackground={showBlackBackground}
        isFadingOut={isFadingOut}
      />
    </>
  );
};

export default App;