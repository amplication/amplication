import { useLazyQuery } from "@apollo/client";
import { GET_EVALUATION_INSIGHTS, GET_USAGE_INSIGHTS } from "../queries";
import { useEffect, useState } from "react";
import {
  UsageInsightsResult,
  EvaluationInsights,
  EnumTimeGroup,
} from "../../models";

type TUsageInsightsData = {
  getUsageInsights: UsageInsightsResult;
};

type TEvaluationInsightsData = {
  getEvaluationInsights: EvaluationInsights;
};

export type BaseUsageInsightsArgs = {
  startDate: Date;
  endDate: Date;
  projectIds: string[];
  timeGroup?: EnumTimeGroup;
};

type DatasetEntry = {
  builds: number;
  entities: number;
  plugins: number;
  moduleActions: number;
  month: string;
};

export const useUsageInsights = ({
  startDate,
  endDate,
  projectIds,
  timeGroup,
}: BaseUsageInsightsArgs) => {
  const [evaluationInsights, setEvaluationInsights] =
    useState<EvaluationInsights | null>(null);

  const [usageInsightsDataset, setUsageInsightsDataset] = useState<
    DatasetEntry[] | null
  >(null);

  const [
    getUsageInsights,
    { error: usageInsightsError, loading: usageInsightsLoading },
  ] = useLazyQuery<TUsageInsightsData>(GET_USAGE_INSIGHTS, {
    variables: { startDate, endDate, projectIds, timeGroup },
    onCompleted: (data) => {
      const dataset = transformInsightsToDataset(data, startDate, endDate);
      setUsageInsightsDataset(dataset);
    },
  });

  const [
    getEvaluationInsights,
    { error: evaluationInsightsError, loading: evaluationInsightsLoading },
  ] = useLazyQuery<TEvaluationInsightsData>(GET_EVALUATION_INSIGHTS, {
    variables: { startDate, endDate, projectIds, timeGroup },
    onCompleted: (data) => {
      setEvaluationInsights(data.getEvaluationInsights);
    },
  });

  useEffect(() => {
    getUsageInsights().catch((error) => console.error(error));
    getEvaluationInsights().catch((error) => console.error(error));
  }, [getEvaluationInsights, getUsageInsights]);

  return {
    usageInsightsDataset,
    usageInsightsError,
    usageInsightsLoading,
    evaluationInsights,
    evaluationInsightsError,
    evaluationInsightsLoading,
  };
};

function transformInsightsToDataset(
  insights: TUsageInsightsData,
  startDate: Date,
  endDate: Date
): DatasetEntry[] {
  const monthYearObj = getMonthYearObject(startDate, endDate);

  for (const [category, { results }] of Object.entries(
    insights.getUsageInsights
  )) {
    if (category === "__typename") continue; // apollo adds __typename to the results so we need to skip it

    for (const metric of results) {
      const key = convertMonthAndYearToKey(metric.timeGroup, metric.year);
      monthYearObj[key][category] += metric.count;
    }
  }

  const dataset = Object.values(monthYearObj)
    .sort((a, b) => {
      const [aYear, aMonth] = a.month.split(".");
      const [bYear, bMonth] = b.month.split(".");
      return (
        parseInt(aYear) - parseInt(bYear) || parseInt(aMonth) - parseInt(bMonth)
      );
    })
    .map((entry) => {
      return {
        ...entry,
        month: convertKeyToDateString(entry.month),
      };
    });

  return dataset;
}

function convertKeyToDateString(key: string) {
  const [year, month] = key.split(".");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

function convertMonthAndYearToKey(month: number, year: number) {
  return `${year}.${month}`;
}

function getMonthYearObject(
  startDate: Date,
  endDate: Date
): Record<string, DatasetEntry> {
  const monthYearArray: string[] = [];
  const currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    const monthYear = convertMonthAndYearToKey(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );

    monthYearArray.push(monthYear);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthYearArray && monthYearArray.length
    ? monthYearArray.reduce((acc, key) => {
        acc[key] = {
          builds: 0,
          entities: 0,
          plugins: 0,
          moduleActions: 0,
          month: key,
        };
        return acc;
      }, {} as Record<string, DatasetEntry>)
    : {};
}
