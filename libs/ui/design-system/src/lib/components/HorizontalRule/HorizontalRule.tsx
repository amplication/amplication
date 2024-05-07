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
  smallSpacing?: boolean;
};

export function HorizontalRule({
  style = EnumHorizontalRuleStyle.Black5,
  doubleSpacing = false,
  smallSpacing = false,
}: Props) {
  return (
    <hr
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${style}`,
        {
          [`${CLASS_NAME}--double-spacing`]: doubleSpacing,
        },
        {
          [`${CLASS_NAME}--small-spacing`]: smallSpacing,
        }
      )}
    />
  );
}
