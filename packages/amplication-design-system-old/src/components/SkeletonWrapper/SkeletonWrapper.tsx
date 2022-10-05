import React from "react";
import "./SkeletonWrapper.scss";
import "skeleton-screen-css";
import classNames from "classnames";

const CLASS_NAME = "amp-skeleton";
const LOADING_ANIMATION_CLASS_NAME = "ssc-head-line";

type SkeletonWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  showSkeleton: boolean;
};

export function SkeletonWrapper({
  className,
  children,
  showSkeleton,
}: SkeletonWrapperProps) {
  return (
    <span className={classNames(CLASS_NAME, className)}>
      {children}
      {showSkeleton && (
        <span className={classNames(`${CLASS_NAME}__skeleton`)}>
          <span className={LOADING_ANIMATION_CLASS_NAME} />
        </span>
      )}
    </span>
  );
}
