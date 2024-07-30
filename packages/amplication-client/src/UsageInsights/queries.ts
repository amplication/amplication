import { gql } from "@apollo/client";

export const GET_USAGE_INSIGHTS = gql`
  query GetUsageInsights(
    $endDate: DateTime!
    $projectIds: [String!]!
    $startDate: DateTime!
    $timeGroup: EnumTimeGroup
  ) {
    getUsageInsights(
      endDate: $endDate
      projectIds: $projectIds
      startDate: $startDate
      timeGroup: $timeGroup
    ) {
      builds {
        results {
          count
          month
          timeGroup
          year
        }
      }
      entities {
        results {
          count
          month
          timeGroup
          year
        }
      }
      plugins {
        results {
          count
          month
          timeGroup
          year
        }
      }
      moduleActions {
        results {
          count
          month
          timeGroup
          year
        }
      }
    }
  }
`;

export const GET_EVALUATION_INSIGHTS = gql`
  query GetEvaluationInsights(
    $endDate: DateTime!
    $projectIds: [String!]!
    $startDate: DateTime!
    $timeGroup: EnumTimeGroup
  ) {
    getEvaluationInsights(
      endDate: $endDate
      projectIds: $projectIds
      startDate: $startDate
      timeGroup: $timeGroup
    ) {
      codeQuality
      costSaved
      loc
      timeSaved
    }
  }
`;
