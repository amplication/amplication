import classNames from "classnames";
import "./VersionTag.scss";

export enum EnumVersionTagState {
  Previous = "previous",
  Current = "current",
  Deprecated = "deprecated",
  Disabled = "disabled",
  UpdateAvailable = "updateAvailable",
}

export type Props = {
  className?: string;
  version: string;
  state?: EnumVersionTagState;
};

const CLASS_NAME = "amp-version-tag";
const LATEST_VERSION_TAG = "latest";

export function VersionTag({
  className,
  version,
  state = EnumVersionTagState.Current,
}: Props) {
  const value = version
    ? version === LATEST_VERSION_TAG
      ? version
      : `v${version}`
    : "none";

  return (
    <span
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${state.toString()}`,
        { [`${CLASS_NAME}--none`]: !version },
        className
      )}
    >
      {value}
    </span>
  );
}
