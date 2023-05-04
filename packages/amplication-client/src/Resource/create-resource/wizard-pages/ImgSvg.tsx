import React, { useEffect, useState } from "react";
import classNames from "classnames";

export const useImageLoader = (currentSrc: string) => {
  const [imageSrc, _setImageSrc] = useState(null);

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
  const [imageSrc] = useImageLoader(image);

  return (
    <img className={classNames(classCss, imgSize)} src={imageSrc} alt={""} />
  );
};

export default ImgSvg;
