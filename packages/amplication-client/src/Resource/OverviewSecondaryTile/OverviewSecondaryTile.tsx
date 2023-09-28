import {
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
  EnumFlexItemMargin,
} from "@amplication/ui/design-system";

import React from "react";

interface Props {
  title: string;
  icon: string;
  message: string;
  footer: React.ReactNode;
  headerExtra?: React.ReactNode;
  onClick?: (e) => void;
}
const OverviewSecondaryTile: React.FC<Props> = ({
  title,
  icon,
  message,
  footer,
  headerExtra,
  onClick,
}) => {
  return (
    <ListItem onClick={onClick} end={footer}>
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <Icon icon={icon} size="small" />
          {title}
        </FlexItem>
      </Text>
      <FlexItem margin={EnumFlexItemMargin.Top}>
        <Text textStyle={EnumTextStyle.Description}>{message}</Text>
      </FlexItem>
      {headerExtra && (
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.ThemeTurquoise}
        >
          <FlexItem margin={EnumFlexItemMargin.Top}>{headerExtra}</FlexItem>
        </Text>
      )}
    </ListItem>
  );
};

export default OverviewSecondaryTile;
