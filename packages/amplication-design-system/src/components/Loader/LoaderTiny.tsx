import React from "react";
import Lottie, { LottieComponentProps } from "lottie-react";

import animationData from "../../assets/amplication-loader-tiny.json";

export type Props = Omit<LottieComponentProps, "animationData">;

export const LoaderTiny = (props: Props) => {
  return <Lottie {...props} animationData={animationData} />;
};
