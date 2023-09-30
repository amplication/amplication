import {
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumFlexDirection,
} from "@amplication/ui/design-system";

import React from "react";

interface Props {
  title: string;
  icon: string;
  message: string;
  footer?: React.ReactNode;
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
      <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Default}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <Icon icon={icon} size="small" />
            {title}
          </FlexItem>
        </Text>

        <Text textStyle={EnumTextStyle.Description}>{message}</Text>
      </FlexItem>
      {headerExtra && (
        <FlexItem margin={EnumFlexItemMargin.Top}>{headerExtra}</FlexItem>
      )}
    </ListItem>
  );
};

export default OverviewSecondaryTile;
