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
import { UsageInsightsDataBox } from "./UsageInsightsDataBox";
import { useUsageInsights } from "./hooks/useUsageInsights";

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

  const {
    usageInsightsDataset,
    evaluationInsights,
    evaluationInsightsLoading,
  } = useUsageInsights({
    startDate,
    endDate,
    projectIds,
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
  }, []);

  const valueFormatter = (value: number) => `${value}`;

  return (
    <Panel
      panelStyle={EnumPanelStyle.Default}
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
        direction={EnumFlexDirection.Row}
        className={`${CLASS_NAME}__chart-container`}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.Large}
      >
        {usageInsightsDataset && (
          <Panel
            className={`${CLASS_NAME}__chart`}
            panelStyle={EnumPanelStyle.Bold}
          >
            <BarChart
              height={300}
              dataset={usageInsightsDataset}
              yAxis={[
                {
                  label: "Total",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "month",
                  classes: {
                    root: "axis-class-name",
                  },
                },
              ]}
              series={[
                {
                  dataKey: "entities",
                  label: "Entities",
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
                  label: "Plugins",
                  valueFormatter,
                  color: chartColors[2],
                },
                {
                  dataKey: "moduleActions",
                  label: "APIs",
                  valueFormatter,
                  color: chartColors[3],
                },
              ]}
            />
          </Panel>
        )}
        <FlexItem
          direction={EnumFlexDirection.Column}
          className={`${CLASS_NAME}__chart-side`}
          gap={EnumGapSize.Large}
        >
          {evaluationInsights && (
            <>
              <UsageInsightsDataBox
                label="Lines of code"
                value={evaluationInsights.loc}
                color={EnumTextColor.ThemeTurquoise}
                icon="code"
              />

              <UsageInsightsDataBox
                label="Time saved"
                value={evaluationInsights.timeSaved}
                color={EnumTextColor.ThemeBlue}
                icon="clock"
                units="hours"
              />
            </>
          )}
        </FlexItem>
      </FlexItem>

      {evaluationInsightsLoading ||
        (!evaluationInsights && <div>Loading...</div>)}
      {evaluationInsights && (
        <>
          <FlexItem margin={EnumFlexItemMargin.Both}>
            <Text textStyle={EnumTextStyle.H4}>Efficiency Metrics</Text>
          </FlexItem>

          <FlexItem gap={EnumGapSize.Large}>
            <UsageInsightsDataBox
              label="Cost saved"
              value={evaluationInsights.costSaved}
              color={EnumTextColor.ThemeGreen}
              icon="dollar-sign"
            />

            <UsageInsightsDataBox
              label="Code quality - bugs prevented"
              value={evaluationInsights.codeQuality}
              color={EnumTextColor.ThemePink}
              icon="check"
            />
          </FlexItem>
        </>
      )}
    </Panel>
  );
};
