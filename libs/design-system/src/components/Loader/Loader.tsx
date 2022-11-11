import classNames from "classnames";
import React, { useEffect } from "react";
import "./Loader.scss";

import Lottie, { LottieComponentProps } from "lottie-react";
import animationFull from "../../assets/amplication-loader-full.json";

const CLASS_NAME = "amp-loader";

export type Props = Omit<LottieComponentProps, "animationData"> & {
  minimumLoadTimeMS?: number;
  fullScreen?: boolean;
  onTimeout?: () => void;
};

export const Loader: React.FC<Props> = ({
  className,
  minimumLoadTimeMS,
  fullScreen,
  onTimeout,
  ...rest
}) => {
  useEffect(() => {
    if (!minimumLoadTimeMS) return;
    const timer = setTimeout(() => {
      onTimeout && onTimeout();
    }, minimumLoadTimeMS);

    return () => clearTimeout(timer);
  }, [onTimeout, minimumLoadTimeMS]);

  return (
    <div
      className={classNames(CLASS_NAME, className, {
        [`${CLASS_NAME}--fullscreen`]: fullScreen,
      })}
    >
      <div className={`${CLASS_NAME}__animation`}>
        <Lottie animationData={animationFull} {...rest} />
      </div>
    </div>
  );
};
