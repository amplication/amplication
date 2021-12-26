import React from "react";
import { Icon as RmwcIcon, IconProps } from "@rmwc/icon";
import "@rmwc/icon/styles";

import "./Icon.scss";

export type Props = IconProps;

export function Icon(props: Props) {
  return <RmwcIcon className="amp-icon" {...props} />;
}
