import React, { useState, useEffect } from "react";
import classNames from "classnames";

export const useImageLoader = (initialSrc: string, currentSrc: string) => {
  const [imageSrc, _setImageSrc] = useState(initialSrc);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      _setImageSrc(currentSrc);
    };
    img.src = currentSrc;
  }, [currentSrc]);

  return [imageSrc];
};

const ImgSvg: React.FC<{
  image: string;
  imgSize?: string;
  classCss?: string;
}> = ({
  image,
  imgSize = "medium",
  classCss = "label-description-selector__logo",
}) => {
  const [imgSrc] = useImageLoader("icon", image);
  return (
    <img className={classNames(classCss, imgSize)} src={imgSrc} alt={""} />
  );
};

export default ImgSvg;
