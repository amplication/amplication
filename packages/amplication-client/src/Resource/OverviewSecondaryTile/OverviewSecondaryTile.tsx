import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
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
}
const OverviewSecondaryTile: React.FC<Props> = ({
  title,
  icon,
  message,
  to,
  themeColor,
  onClick,
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
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
          <Icon icon={icon} color={EnumTextColor.White} />
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
            {title}
          </Text>
        </FlexItem>

        <Text textStyle={EnumTextStyle.Subtle}>{message}</Text>
      </ListItem>
    </List>
  );
};

export default OverviewSecondaryTile;
