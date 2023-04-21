import { useState, useEffect } from 'react';

const loadImage = async (url) => {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
        image.src = url;
    });
};

const loadImages = async (urls) => {
    const promises = urls.map((url) => loadImage(url));
    const results = await Promise.allSettled(promises);

    return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
};

export const useLoadedImages = (imagesColor, imagesGray) => {
    const [images, setImages] = useState([]);
    const [imagesGrayscale, setImagesGrayscale] = useState([]);

    useEffect(() => {
        (async () => {
            const loadedImagesColor = await loadImages(imagesColor);
            setImages(loadedImagesColor);

            const loadedImagesGray = await loadImages(imagesGray);
            setImagesGrayscale(loadedImagesGray);
        })();
    }, [imagesColor, imagesGray]);

    return { images, imagesGrayscale };
};
