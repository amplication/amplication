import classNames from "classnames";
import "./VersionTag.scss";

export const LATEST_VERSION_TAG = "latest";
export const DEV_VERSION_TAG = "@dev";
export const NEVER_VERSION_TAG = "Never";
export const SPECIAL_TAGS = [
  LATEST_VERSION_TAG,
  DEV_VERSION_TAG,
  NEVER_VERSION_TAG,
];

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

export function VersionTag({
  className,
  version,
  state = EnumVersionTagState.Current,
}: Props) {
  const value = version
    ? SPECIAL_TAGS.includes(version)
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
