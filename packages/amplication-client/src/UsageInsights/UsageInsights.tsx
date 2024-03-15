import React, { useCallback, useEffect } from "react";
import { useUsageInsights } from "./hooks/useUsageInsights";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import "./UsageInsights.scss";
import { MultiStateToggle, Text } from "@amplication/ui/design-system";

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
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - numberOfMonths);
    setStartDate(lastMonth);
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
    <div className={CLASS_NAME}>
      <Text>Usage Insights</Text>
      <MultiStateToggle
        label=""
        name="usageInsightsTimeFrame"
        options={OPTIONS}
        onChange={handleChangeTimeFrame}
        selectedValue={timeFrame}
      />
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
      {evaluationInsightsLoading ||
        (!evaluationInsights && <div>Loading...</div>)}
      {evaluationInsights && (
        <>
          <div>
            <span>Lines of code: {evaluationInsights.loc}</span>
            {" | "}
            <span>Time saved: {evaluationInsights.timeSaved}</span>
          </div>
          <div>
            <span>Cost saved: {evaluationInsights.costSaved}</span>
            {" | "}
            <span>
              Code quality - bugs prevented: {evaluationInsights.codeQuality}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
