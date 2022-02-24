import { Icon, Label } from "@amplication/design-system";
import React from "react";

type Props = React.HTMLProps<HTMLDivElement> & {
  imgSrc?: string;
  organizationName: string;
};
export default function SelectMenuButton(props: Props) {
  const { imgSrc, onClick, organizationName } = props;

  return (
    <div style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
      {imgSrc && <img src={imgSrc} style={{ width: 24, height: 24 }} />}
      <Label
        text={organizationName + " connected"}
        style={{
          marginLeft: 8,
          marginRight: 8,
          fontSize: 12,
        }}
      />
      <Icon icon="chevron_down" />
    </div>
  );
}
