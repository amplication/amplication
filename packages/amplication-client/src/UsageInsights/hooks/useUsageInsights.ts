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
      const dataset = transformInsightsToDataset(data);
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

    for (const metric of results) {
      const monthIndex = metric.timeGroup - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        dataset[monthIndex][category] += metric.count;
      }
    }
  }

  return dataset;
}
