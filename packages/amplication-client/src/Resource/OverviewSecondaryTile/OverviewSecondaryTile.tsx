import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  Panel,
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
    <Panel
      removePadding
      panelStyle={EnumPanelStyle.Default}
      themeColor={themeColor}
    >
      <List listStyle={EnumListStyle.Default} style={{ height: "100%" }}>
        <ListItem
          showDefaultActionIcon
          to={to}
          onClick={onClick}
          direction={EnumFlexDirection.Column}
          gap={EnumGapSize.Large}
        >
          <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
            <Icon icon={icon} color={EnumTextColor.White} />
            <Text textStyle={EnumTextStyle.H4}>{title}</Text>
          </FlexItem>

          <Text textStyle={EnumTextStyle.Description}>{message}</Text>
        </ListItem>
      </List>
    </Panel>
  );
};

export default OverviewSecondaryTile;
