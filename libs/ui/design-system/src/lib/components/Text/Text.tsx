import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Text.scss";

export enum EnumTextStyle {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  Normal = "normal",
  Tag = "tag",
  Subtle = "subtle",
  Description = "description",
  Label = "label",
}

export enum EnumTextColor {
  Black20 = "gray-20",
  Black = "gray-full",
  White = "gray-base",
  ThemeTurquoise = "theme-turquoise",
  ThemeBlue = "theme-blue",
  ThemeGreen = "theme-green",
  ThemeRed = "theme-red",
  ThemeOrange = "theme-orange",
  Primary = "primary",
  ThemePink = "theme-pink",
  Secondary = "secondary",
}

export enum EnumTextAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum EnumTextWeight {
  Regular = "regular",
  Bold = "bold",
  SemiBold = "semi-bold",
}

export type Props = {
  textStyle?: EnumTextStyle;
  textWeight?: EnumTextWeight;
  underline?: boolean;
  textColor?: EnumTextColor;
  className?: string;
  children: ReactNode;
  textAlign?: EnumTextAlign;
  singleLineEllipsis?: boolean;
  noWrap?: boolean;
};

const STYLE_TO_TAG: { [key: string]: string } = {
  [EnumTextStyle.H1]: "h1",
  [EnumTextStyle.H2]: "h2",
  [EnumTextStyle.H3]: "h3",
  [EnumTextStyle.H4]: "h4",
  [EnumTextStyle.Normal]: "span",
  [EnumTextStyle.Tag]: "span",
  [EnumTextStyle.Subtle]: "span",
  [EnumTextStyle.Description]: "span",
  [EnumTextStyle.Label]: "span",
};

const CLASS_NAME = "amp-text";

export function Text({
  className,
  textStyle = EnumTextStyle.Normal,
  textWeight,
  textColor,
  children,
  textAlign = EnumTextAlign.Left,
  underline = false,
  noWrap = false,
  singleLineEllipsis = false,
}: Props) {
  const styleClassName = `${CLASS_NAME}--${textStyle}`;
  const weightClassName = textWeight && `${CLASS_NAME}--weight-${textWeight}`;
  const colorStyle = textColor && { color: `var(--${textColor})` };

  const TagName = STYLE_TO_TAG[textStyle] as keyof JSX.IntrinsicElements;

  return (
    <TagName
      className={classNames(
        CLASS_NAME,
        styleClassName,
        weightClassName,
        className
      )}
      style={{
        ...colorStyle,
        textAlign,
        textDecoration: underline ? "underline" : undefined,
        whiteSpace: singleLineEllipsis || noWrap ? "nowrap" : undefined,
        overflow: singleLineEllipsis ? "hidden" : undefined,
        textOverflow: singleLineEllipsis ? "ellipsis" : undefined,
        width: singleLineEllipsis ? "100%" : undefined,
      }}
    >
      {children}
    </TagName>
  );
}
