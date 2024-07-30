import {
  CircleBadge,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Panel,
  SkeletonWrapper,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { InfoButton } from "../Components/InfoButton";
import { useContactUs } from "../Workspaces/hooks/useContactUs";
import "./UsageInsightsDataBox.scss";

const CLASS_NAME = "usage-insights-data-box";

export type UsageInsightsDataBoxProps = {
  icon: string;
  color: EnumTextColor;
  label: string;
  info: string;
  linkText?: string;
  endnotes?: string;
  units?: string;
};

export enum EnumValueFormat {
  Number = "number",
  Currency = "currency",
  None = "none",
}

type Props = {
  value: string | number;
  rawData: UsageInsightsDataBoxProps;
  valueFormat?: EnumValueFormat;
  loading: boolean;
};

const formatValue = (value: string | number, format: EnumValueFormat) => {
  switch (format) {
    case EnumValueFormat.Currency:
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value as number);
    case EnumValueFormat.Number:
      return new Intl.NumberFormat().format(value as number);
    default:
      return value;
  }
};

export const UsageInsightsDataBox: React.FC<Props> = ({
  rawData,
  value,
  valueFormat,
  loading,
}) => {
  const { icon, color, label, info, units, endnotes } = rawData;

  const { contactUsLink } = useContactUs({});

  const formattedValue = valueFormat ? formatValue(value, valueFormat) : value;

  return (
    <Panel panelStyle={EnumPanelStyle.Surface} className={`${CLASS_NAME}`}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Start}
        contentAlign={EnumContentAlign.Start}
        className={`${CLASS_NAME}__content`}
      >
        <FlexItem
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Start}
          end={
            <div className={`${CLASS_NAME}__tooltip`}>
              <InfoButton
                title={label}
                explanation={info}
                endnotes={endnotes}
                linkUrl={contactUsLink}
                linkPlaceHolder="{{contactUsLink}}"
              />
            </div>
          }
        >
          <CircleBadge size={"medium"} themeColor={color}>
            <Icon icon={icon} size="xlarge" />
          </CircleBadge>
          <Text textStyle={EnumTextStyle.H4} textColor={color}>
            {label}
          </Text>
        </FlexItem>

        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Center}
          margin={EnumFlexItemMargin.Top}
        >
          <SkeletonWrapper
            showSkeleton={loading}
            className={`${CLASS_NAME}__skeleton`}
          >
            <Text textStyle={EnumTextStyle.H1}>
              {(!loading && formattedValue) || "."}
            </Text>
          </SkeletonWrapper>
          {units && (
            <Text
              textStyle={EnumTextStyle.H4}
              textColor={EnumTextColor.Black20}
            >
              {units}
            </Text>
          )}
        </FlexItem>
      </FlexItem>
    </Panel>
  );
};
