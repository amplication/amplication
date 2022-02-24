import React from "react";

type Props = {
  src: string;
  size: AvatarSizeEnum;
};

export enum AvatarSizeEnum {
  small = "24px",
}

export default function Avatar(props: Props) {
  const { size } = props;
  return <img {...props} style={{ width: size, height: size }} />;
}
