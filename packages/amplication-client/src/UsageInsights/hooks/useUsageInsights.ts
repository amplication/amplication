import { useLazyQuery } from "@apollo/client";
import { GET_EVALUATION_INSIGHTS, GET_USAGE_INSIGHTS } from "../queries";
import { useEffect, useState } from "react";
import { AnalyticsResults, EvaluationInsights } from "../../models";

type TUsageInsightsData = {
  getUsageInsights: AnalyticsResults;
};

type TEvaluationInsightsData = {
  getEvaluationInsights: EvaluationInsights;
};

export type BaseUsageInsightsArgs = {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
  projectId?: string;
  resourceId?: string;
};

type DatasetEntry = {
  builds: number;
  entities: number;
  plugins: number;
  moduleActions: number;
  month: string;
};

export const useUsageInsights = ({
  workspaceId,
  startDate,
  endDate,
  projectId,
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
    variables: { workspaceId, startDate, endDate, projectId },
    onCompleted: (data) => {
      const dataset = transformInsightsToDataset(data);
      setUsageInsightsDataset(dataset);
    },
  });

  const [
    getEvaluationInsights,
    { error: evaluationInsightsError, loading: evaluationInsightsLoading },
  ] = useLazyQuery<TEvaluationInsightsData>(GET_EVALUATION_INSIGHTS, {
    variables: { workspaceId, startDate, endDate, projectId },
    onCompleted: (data) => {
      setEvaluationInsights(data.getEvaluationInsights);
    },
  });

  useEffect(() => {
    getUsageInsights();
    console.log("start date", startDate);
    console.log("end date", endDate);
    getEvaluationInsights();
  }, [endDate, getEvaluationInsights, getUsageInsights, startDate]);

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
  insights: TUsageInsightsData
): DatasetEntry[] {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dataset: DatasetEntry[] = months.map((month) => ({
    builds: 0,
    entities: 0,
    plugins: 0,
    moduleActions: 0,
    month,
  }));

  for (const [category, { results }] of Object.entries(
    insights.getUsageInsights
  )) {
    if (category === "__typename") continue; // apollo adds __typename to the results so we need to skip it

    for (const result of results) {
      for (const metric of result.metrics) {
        const monthIndex = parseInt(metric.timeGroup, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          dataset[monthIndex][category] += metric.count;
        }
      }
    }
  }

  return dataset;
}