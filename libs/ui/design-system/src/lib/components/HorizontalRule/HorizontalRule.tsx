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
  doubleSpacing?: boolean;
};

export function HorizontalRule({
  style = EnumHorizontalRuleStyle.Black5,
  doubleSpacing = false,
}: Props) {
  return (
    <hr
      className={classNames(CLASS_NAME, `${CLASS_NAME}--${style}`, {
        [`${CLASS_NAME}--double-spacing`]: doubleSpacing,
      })}
    />
  );
}
