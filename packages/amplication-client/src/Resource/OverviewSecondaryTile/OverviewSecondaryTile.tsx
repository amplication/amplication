import {
  EnumFlexDirection,
  EnumGapSize,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  Icon,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";

import React from "react";

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
        start={<Icon icon={icon} size={"xxlarge"} />}
      >
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          {title}
        </Text>

        <Text textStyle={EnumTextStyle.Subtle}>{message}</Text>
        {children}
      </ListItem>
    </List>
  );
};

export default OverviewSecondaryTile;
