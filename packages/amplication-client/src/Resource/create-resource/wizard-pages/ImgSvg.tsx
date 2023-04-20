import classNames from "classnames";

const ImgSvg = (
  image,
  imgSize = "medium",
  classCss = "label-description-selector__logo"
) => <img className={classNames(classCss, imgSize)} src={image} alt={""} />;

export default ImgSvg;
