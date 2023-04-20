import { useState, useEffect } from 'react';

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

                canvas.toBlob((blob) => {
                    grayscaleImage.src = URL.createObjectURL(blob);
                }, 'image/webp');
            };
            image.onerror = (err) => reject(err);
            image.src = url;
        });
    }));
};

export const useLoadedImages = (imageURLs) => {
    const [images, setImages] = useState([]);
    const [imagesGrayscale, setImagesGrayscale] = useState([]);

    useEffect(() => {
        loadImages(imageURLs).then((loadedImages) => {
            setImages(loadedImages.map(img => img.color));
            setImagesGrayscale(loadedImages.map(img => img.grayscale));
        });
    }, [imageURLs]);

    return { images, imagesGrayscale };
};
