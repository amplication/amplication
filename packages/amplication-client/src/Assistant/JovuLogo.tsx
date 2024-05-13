import classNames from "classnames";
import logo from "../assets/jovu-logo.svg";
import "./JovuLogo.scss";
import { CircularProgress } from "@amplication/ui/design-system";
import Lottie from "lottie-react";
import animatedLogo from "../assets/jovu-logo.json";

enum EnumLogoSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type Props = {
  size?: EnumLogoSize;
  loading?: boolean;
};

const CLASS_NAME = "jovu-logo";

const JovuLogo = ({ size = EnumLogoSize.Small, loading = false }: Props) => {
  return (
    <div
      className={classNames(CLASS_NAME, `${CLASS_NAME}--${size}`, {
        [`${CLASS_NAME}--loading`]: loading,
      })}
    >
      <div className={`${CLASS_NAME}__logo-wrapper`}>
        {loading ? (
          <Lottie animationData={animatedLogo} />
        ) : (
          <img className={`${CLASS_NAME}__logo`} src={logo} alt="jovu" />
        )}
      </div>

      {loading && <CircularProgress centerToParent thickness={2} />}
    </div>
  );
};

export default JovuLogo;
