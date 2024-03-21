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
import { InfoButton } from "../Components/InfoButton";
import { useQuery } from "@apollo/client";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";
import { useAppContext } from "../context/appContext";

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

type Props = {
  value: string | number;
  rawData: UsageInsightsDataBoxProps;
};

export const UsageInsightsDataBox: React.FC<Props> = ({ rawData, value }) => {
  const { icon, color, label, info, units, endnotes } = rawData;
  const { currentWorkspace } = useAppContext();

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bold}
      className={`${CLASS_NAME}`}
      style={{
        borderColor: `var(--${color})`,
      }}
    >
      <FlexItem
        itemsAlign={EnumItemsAlign.Stretch}
        contentAlign={EnumContentAlign.Center}
        className={`${CLASS_NAME}__content`}
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
          <Text textStyle={EnumTextStyle.H4} textColor={color}>
            {label}
          </Text>
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
        <div className={`${CLASS_NAME}__tooltip`}>
          <InfoButton
            title={label}
            explanation={info}
            endnotes={endnotes}
            linkUrl={data?.contactUsLink}
            linkPlaceHolder="{{contactUsLink}}"
          />
        </div>
      </FlexItem>
    </Panel>
  );
};
