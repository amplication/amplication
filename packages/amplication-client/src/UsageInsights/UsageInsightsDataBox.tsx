import {
  CircleBadge,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import "./UsageInsightsDataBox.scss";

const CLASS_NAME = "usage-insights-data-box";

type Props = {
  icon: string;
  color: EnumTextColor;
  label: string;
  value: string | number;
  units?: string;
};

export const UsageInsightsDataBox: React.FC<Props> = ({
  icon,
  color,
  label,
  value,
  units,
}) => {
  return (
    <Panel panelStyle={EnumPanelStyle.Bold} className={`${CLASS_NAME}`}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        start={
          <CircleBadge size={"medium"} themeColor={color}>
            <Icon icon={icon} size="xlarge" />
          </CircleBadge>
        }
      >
        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Center}
        >
          <Text textStyle={EnumTextStyle.Tag}>{label}</Text>
          <span>
            <Text textStyle={EnumTextStyle.H1}>{value}</Text>
            {units && (
              <Text
                textStyle={EnumTextStyle.H3}
                textColor={EnumTextColor.Black20}
              >
                {" "}
                {units}
              </Text>
            )}
          </span>
        </FlexItem>
      </FlexItem>
    </Panel>
  );
};
