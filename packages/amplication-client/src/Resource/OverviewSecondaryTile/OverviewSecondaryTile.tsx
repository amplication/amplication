import {
  EnumFlexDirection,
  EnumGapSize,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";

import React from "react";
import { TitleAndIcon } from "../../Components/TitleAndIcon";

interface Props {
  title: string;
  icon: string;
  message: string;
  to: string;
  onClick?: (e) => void;
  themeColor?: EnumTextColor;
  children?: React.ReactNode;
}
const OverviewSecondaryTile: React.FC<Props> = ({
  title,
  icon,
  message,
  to,
  themeColor,
  onClick,
  children,
}) => {
  return (
    <List
      listStyle={EnumListStyle.Transparent}
      style={{ height: "100%" }}
      themeColor={themeColor}
    >
      <ListItem
        showDefaultActionIcon
        to={to}
        onClick={onClick}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Default}
      >
        <TitleAndIcon icon={icon} title={title} />

        <Text textStyle={EnumTextStyle.Subtle}>{message}</Text>
        {children}
      </ListItem>
    </List>
  );
};

export default OverviewSecondaryTile;
