import classNames from "classnames";
import "./EnabledIndicator.scss";

const CLASS_NAME = "amp-enabled-indicator";

export type Props = {
  enabled: boolean;
  className?: string;
};

function EnabledIndicator({ enabled, className }: Props) {
  return (
    <span
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${enabled ? "enabled" : "disabled"}`,
        className
      )}
    ></span>
  );
}

export default EnabledIndicator;
