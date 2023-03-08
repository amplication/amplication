import classNames from "classnames";
import React, { useEffect } from "react";
import "./FullScreenLoader.scss";
import { Loader, Props as LoaderProps } from "./Loader";

const CLASS_NAME = "amp-loader";

export type Props = LoaderProps & {
  minimumLoadTimeMS?: number;
  fullScreen?: boolean;
  onTimeout?: () => void;
};

export const FullScreenLoader: React.FC<Props> = ({
  className,
  minimumLoadTimeMS,
  onTimeout,
  animationType,
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
      className={classNames(CLASS_NAME, className, `${CLASS_NAME}--fullscreen`)}
    >
      <div className={`${CLASS_NAME}__animation`}>
        <Loader animationType={animationType} {...rest} />
      </div>
    </div>
  );
};
