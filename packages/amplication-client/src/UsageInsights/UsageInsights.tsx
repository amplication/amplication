import React, { useCallback, useEffect } from "react";
import { useUsageInsights } from "./hooks/useUsageInsights";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import "./UsageInsights.scss";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
  Icon,
  MultiStateToggle,
  Panel,
  Popover,
  Text,
} from "@amplication/ui/design-system";

const CLASS_NAME = "usage-insights";

enum EnumTimeFrame {
  LAST_YEAR = "LAST_YEAR",
  LAST_MONTH = "LAST_MONTH",
  LAST_3_MONTHS = "LAST_3_MONTHS",
}

const OPTIONS = [
  { value: EnumTimeFrame.LAST_YEAR, label: "Last year" },
  { value: EnumTimeFrame.LAST_MONTH, label: "Last month" },
  { value: EnumTimeFrame.LAST_3_MONTHS, label: "Last 3 months" },
];

type Props = {
  workspaceId: string;
  projectId?: string;
};

export const UsageInsights: React.FC<Props> = ({ workspaceId, projectId }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [timeFrame, setTimeFrame] = React.useState<EnumTimeFrame>(
    EnumTimeFrame.LAST_YEAR
  );

  const {
    usageInsightsDataset,
    usageInsightsLoading,
    evaluationInsights,
    evaluationInsightsLoading,
  } = useUsageInsights({
    workspaceId,
    startDate,
    endDate,
    projectId,
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
  }, [getLastYear]);

  const chartSetting = {
    yAxis: [
      {
        label: "amount",
      },
    ],
    width: 700,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };
  const valueFormatter = (value: number) => `${value}`;

  if (usageInsightsLoading || !usageInsightsDataset) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MultiStateToggle
        label=""
        name="usageInsightsTimeFrame"
        options={OPTIONS}
        onChange={handleChangeTimeFrame}
        selectedValue={timeFrame}
      />
      <div className={CLASS_NAME}>
        <Text>Usage Insights</Text>

        <BarChart
          dataset={usageInsightsDataset}
          xAxis={[{ scaleType: "band", dataKey: "month" }]}
          series={[
            { dataKey: "entities", label: "Entities", valueFormatter },
            { dataKey: "builds", label: "Builds", valueFormatter },
            { dataKey: "plugins", label: "Plugins", valueFormatter },
            { dataKey: "moduleActions", label: "APIs", valueFormatter },
          ]}
          {...chartSetting}
        />
      </div>
      {evaluationInsightsLoading ||
        (!evaluationInsights && <div>Loading...</div>)}
      {evaluationInsights && (
        <>
          <FlexItem>
            <Panel>
              <FlexItem
                direction={EnumFlexDirection.Column}
                itemsAlign={EnumItemsAlign.Center}
                contentAlign={EnumContentAlign.Center}
              >
                <div>
                  <Icon icon="code" />
                  <span>Lines of code: {evaluationInsights.loc}</span>
                </div>
                <div className={`${CLASS_NAME}__tooltip`}>
                  <Popover content={"bla bla bla"} placement="right">
                    <Icon icon="info_circle" />
                  </Popover>
                </div>
              </FlexItem>
            </Panel>
            <Panel>
              <FlexItem
                direction={EnumFlexDirection.Column}
                itemsAlign={EnumItemsAlign.Center}
                contentAlign={EnumContentAlign.Center}
              >
                <div>
                  <Icon icon="clock" />
                  <span>Time saved: {evaluationInsights.timeSaved}</span>
                </div>
                <div className={`${CLASS_NAME}__tooltip`}>
                  <Popover content={"bla bla bla"} placement="right">
                    <Icon icon="info_circle" />
                  </Popover>
                </div>
              </FlexItem>
            </Panel>
          </FlexItem>
          <FlexItem>
            <Panel>
              <FlexItem
                direction={EnumFlexDirection.Column}
                itemsAlign={EnumItemsAlign.Center}
                contentAlign={EnumContentAlign.Center}
              >
                <div>
                  <Icon icon="dollar-sign" />
                  <span>Cost saved: {evaluationInsights.costSaved}</span>
                </div>
                <div className={`${CLASS_NAME}__tooltip`}>
                  <Popover content={"bla bla bla"} placement="right">
                    <Icon icon="info_circle" />
                  </Popover>
                </div>
              </FlexItem>
            </Panel>
            <Panel>
              <FlexItem
                direction={EnumFlexDirection.Column}
                itemsAlign={EnumItemsAlign.Center}
                contentAlign={EnumContentAlign.Center}
              >
                <div>
                  <span>
                    <Icon icon="check" />
                    Code quality - bugs prevented:
                    {evaluationInsights.codeQuality}
                  </span>
                </div>
                <div className={`${CLASS_NAME}__tooltip`}>
                  <Popover content={"bla bla bla"} placement="right">
                    <Icon icon="info_circle" />
                  </Popover>
                </div>
              </FlexItem>
            </Panel>
          </FlexItem>
        </>
      )}
    </>
  );
};
