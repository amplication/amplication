import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  MultiStateToggle,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useCallback, useEffect } from "react";
import "./UsageInsights.scss";
import { EnumValueFormat, UsageInsightsDataBox } from "./UsageInsightsDataBox";
import { useUsageInsights } from "./hooks/useUsageInsights";
import { EnumTimeGroup } from "../models";
import { USAGE_INSIGHTS_DATA_BOX_DATA } from "./UsageInsightsDataBoxData";

const CLASS_NAME = "usage-insights";

enum EnumTimeFrame {
  LAST_YEAR = "LAST_YEAR",
  LAST_MONTH = "LAST_MONTH",
  LAST_3_MONTHS = "LAST_3_MONTHS",
}

const OPTIONS = [
  { value: EnumTimeFrame.LAST_MONTH, label: "Last month" },
  { value: EnumTimeFrame.LAST_3_MONTHS, label: "Last 3 months" },
  { value: EnumTimeFrame.LAST_YEAR, label: "Last year" },
];

type Props = {
  projectIds: string[];
};

const chartColors: { [key: number]: string } = {
  0: "#31C587",
  1: "#F85B6E",
  2: "#20A4F3",
  3: "#f685a1",
};

export const UsageInsights: React.FC<Props> = ({ projectIds }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [timeFrame, setTimeFrame] = React.useState<EnumTimeFrame>(
    EnumTimeFrame.LAST_YEAR
  );
  const [timeGroup, setTimeGroup] = React.useState<EnumTimeGroup>(
    EnumTimeGroup.Month
  );

  const {
    usageInsightsDataset,
    evaluationInsights,
    evaluationInsightsLoading,
  } = useUsageInsights({
    startDate,
    endDate,
    projectIds,
    timeGroup,
  });

  const getLastYear = useCallback(() => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    setStartDate(lastYear);
    setEndDate(new Date());
  }, []);

  const getLastXMonth = useCallback((numberOfMonths: number) => {
    const lastXMonth = new Date();
    lastXMonth.setMonth(lastXMonth.getMonth() - numberOfMonths);
    setStartDate(lastXMonth);
    setEndDate(new Date());
  }, []);

  const handleChangeTimeFrame = useCallback(
    (value: EnumTimeFrame) => {
      setTimeFrame(value);
      switch (value) {
        case EnumTimeFrame.LAST_YEAR:
          getLastYear();
          break;
        case EnumTimeFrame.LAST_MONTH:
          getLastXMonth(1);
          break;
        case EnumTimeFrame.LAST_3_MONTHS:
          getLastXMonth(3);
          break;
      }
    },
    [getLastYear, getLastXMonth]
  );

  useEffect(() => {
    // set default time frame to last year when component is mounted
    getLastYear();
    // set default time group to month when component is mounted
    setTimeGroup(EnumTimeGroup.Month);
  }, []);

  const valueFormatter = (value: number) => `${value}`;

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bordered}
      themeColor={EnumTextColor.ThemeTurquoise}
      className={CLASS_NAME}
    >
      <FlexItem>
        <MultiStateToggle
          label="Select Time Frame"
          name="usageInsightsTimeFrame"
          options={OPTIONS}
          onChange={handleChangeTimeFrame}
          selectedValue={timeFrame}
          className={`${CLASS_NAME}__toggle`}
        />
      </FlexItem>
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.H4}>Productivity Metrics</Text>
      </FlexItem>
      <FlexItem
        direction={EnumFlexDirection.Column}
        className={`${CLASS_NAME}__chart-container`}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.Small}
      >
        <Panel
          className={`${CLASS_NAME}__chart`}
          panelStyle={EnumPanelStyle.Surface}
        >
          {usageInsightsDataset && (
            <BarChart
              height={250}
              dataset={usageInsightsDataset}
              yAxis={[
                {
                  label: "Total",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: timeGroup.toLowerCase(),
                  classes: {
                    root: "axis-class-name",
                  },
                },
              ]}
              series={[
                {
                  dataKey: "entities",
                  label: "Entity Changes",
                  valueFormatter,
                  color: chartColors[0],
                },
                {
                  dataKey: "builds",
                  label: "Builds",
                  valueFormatter,
                  color: chartColors[1],
                },
                {
                  dataKey: "plugins",
                  label: "Plugin Updates",
                  valueFormatter,
                  color: chartColors[2],
                },
                {
                  dataKey: "moduleActions",
                  label: "API Changes",
                  valueFormatter,
                  color: chartColors[3],
                },
              ]}
            />
          )}
        </Panel>

        {(evaluationInsightsLoading ||
          (evaluationInsights && evaluationInsights.loc !== 0)) && (
          <FlexItem
            direction={EnumFlexDirection.Row}
            className={`${CLASS_NAME}__chart-side`}
            itemsAlign={EnumItemsAlign.Stretch}
            gap={EnumGapSize.Small}
          >
            <>
              <UsageInsightsDataBox
                value={evaluationInsights?.loc}
                rawData={USAGE_INSIGHTS_DATA_BOX_DATA[0]}
                valueFormat={EnumValueFormat.Number}
                loading={evaluationInsightsLoading}
              />

              <UsageInsightsDataBox
                value={evaluationInsights?.timeSaved}
                valueFormat={EnumValueFormat.Number}
                rawData={USAGE_INSIGHTS_DATA_BOX_DATA[1]}
                loading={evaluationInsightsLoading}
              />
            </>
          </FlexItem>
        )}
      </FlexItem>

      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.H4}>Efficiency Metrics</Text>
      </FlexItem>
      {evaluationInsights && evaluationInsights.loc === 0 && (
        <FlexItem>
          <Text textStyle={EnumTextStyle.Tag}>
            Generate the code for your Services to expose here the productivity
            and efficiency metrics of your projects
          </Text>
        </FlexItem>
      )}
      {(evaluationInsightsLoading ||
        (evaluationInsights && evaluationInsights.loc !== 0)) && (
        <>
          <FlexItem gap={EnumGapSize.Small}>
            <UsageInsightsDataBox
              loading={evaluationInsightsLoading}
              value={evaluationInsights?.costSaved}
              valueFormat={EnumValueFormat.Currency}
              rawData={USAGE_INSIGHTS_DATA_BOX_DATA[2]}
            />

            <UsageInsightsDataBox
              loading={evaluationInsightsLoading}
              value={evaluationInsights?.codeQuality}
              rawData={USAGE_INSIGHTS_DATA_BOX_DATA[3]}
              valueFormat={EnumValueFormat.Number}
            />
          </FlexItem>
        </>
      )}
    </Panel>
  );
};
