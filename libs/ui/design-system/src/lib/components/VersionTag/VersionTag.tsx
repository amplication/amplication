import classNames from "classnames";
import "./VersionTag.scss";

export type Props = {
  className?: string;
  version: string;
  state?: "previous" | "current" | "deprecated" | "disabled";
};

const CLASS_NAME = "amp-version-tag";

export function VersionTag({ className, version, state = "current" }: Props) {
  const value = version ? `v${version}` : "none";

  return (
    <span
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${state}`,
        { [`${CLASS_NAME}--none`]: !version },
        className
      )}
    >
      {value}
    </span>
  );
}
