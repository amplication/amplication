import React, { useEffect, useState } from "react";
import classNames from "classnames";

const getBase64Image = async (imgSrc: string) => {
  const data = await fetch(imgSrc);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
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
  const [imageBase64Str, setImageBase64Str] = useState<string>();

  useEffect(() => {
    getBase64Image(image).then((res: string) => setImageBase64Str(res));
  }, []);

  return (
    <img
      className={classNames(classCss, imgSize)}
      src={imageBase64Str}
      alt={""}
    />
  );
};

export default ImgSvg;
