import classNames from "classnames";
import logo from "../assets/jovu-logo.svg";
import "./JovuLogo.scss";
import { CircularProgress } from "@amplication/ui/design-system";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animatedLogo from "../assets/jovu-logo.json";
import { useEffect, useRef, useState } from "react";

export enum EnumLogoSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLArge = "extra-large",
}

type Props = {
  size?: EnumLogoSize;
  loading?: boolean;
  useCircularProgress?: boolean;
};

const CLASS_NAME = "jovu-logo";

const JovuLogo = ({
  size = EnumLogoSize.Small,
  loading = false,
  useCircularProgress = true,
}: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const [, setShowAnimation] = useState(true);

  //use lottieRef to stop and start animation every 4 seconds
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setShowAnimation((prev) => {
          lottieRef.current?.setSpeed(prev ? 0 : 1);
          return !prev;
        });
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div
      className={classNames(CLASS_NAME, `${CLASS_NAME}--${size}`, {
        [`${CLASS_NAME}--loading`]: loading,
      })}
    >
      <div className={`${CLASS_NAME}__logo-wrapper`}>
        {loading ? (
          <Lottie
            lottieRef={lottieRef}
            loop={true}
            animationData={animatedLogo}
          />
        ) : (
          <img className={`${CLASS_NAME}__logo`} src={logo} alt="jovu" />
        )}
      </div>

      {loading && useCircularProgress && (
        <CircularProgress centerToParent thickness={2} />
      )}
    </div>
  );
};

export default JovuLogo;
