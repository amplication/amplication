import React from "react";
import { Props as SvgThemeImageProps, SvgThemeImage } from "./SvgThemeImage";
import "./EmptyState.scss";

type Props = SvgThemeImageProps & {
  message: string;
  children?: React.ReactNode;
};

const CLASS_NAME = "empty-state";

export const EmptyState = ({ message, children, ...rest }: Props) => {
  return (
    <div className={`${CLASS_NAME}`}>
      <SvgThemeImage {...rest} />
      <p>{message}</p>
      {!!children && children}
    </div>
  );
};
