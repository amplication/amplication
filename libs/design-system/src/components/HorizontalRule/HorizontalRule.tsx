import React from "react";
import classNames from "classnames";
import "./HorizontalRule.scss";

const CLASS_NAME = "amp-horizontal-rule";

export enum EnumHorizontalRuleStyle {
  Black5 = "black5",
  Black10 = "black10",
}

export type Props = {
  style?: EnumHorizontalRuleStyle;
};

export function HorizontalRule({
  style = EnumHorizontalRuleStyle.Black5,
}: Props) {
  return <hr className={classNames(CLASS_NAME, `${CLASS_NAME}--${style}`)} />;
}
