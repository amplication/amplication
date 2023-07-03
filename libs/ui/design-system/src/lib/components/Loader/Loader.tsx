import React from "react";
import Lottie, { LottieComponentProps } from "lottie-react";

import animationFull from "../../assets/amplication-loader-full.json";
import animationTiny from "../../assets/amplication-loader-tiny.json";

export enum AnimationType {
  Full = "full",
  Tiny = "tiny",
}

const getAnimation = (animationType: AnimationType) => {
  switch (animationType) {
    case AnimationType.Full:
      return animationFull;
    case AnimationType.Tiny:
      return animationTiny;
  }
};

export type Props = Omit<LottieComponentProps, "animationData"> & {
  animationType: AnimationType;
};

export const Loader: React.FC<Props> = ({ animationType, ...props }) => {
  return <Lottie animationData={getAnimation(animationType)} {...props} />;
};
