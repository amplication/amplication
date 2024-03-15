import { gql } from "@apollo/client";

export const GET_USAGE_INSIGHTS = gql`
  query getUsageInsights(
    $endDate: DateTime!
    $startDate: DateTime!
    $workspaceId: String!
    $projectId: String
  ) {
    getUsageInsights(
      endDate: $endDate
      startDate: $startDate
      workspaceId: $workspaceId
      projectId: $projectId
    ) {
      builds {
        results {
          metrics {
            count
            timeGroup
          }
          year
        }
      }
      entities {
        results {
          metrics {
            count
            timeGroup
          }
          year
        }
      }
      plugins {
        results {
          year
          metrics {
            timeGroup
            count
          }
        }
      }
      moduleActions {
        results {
          year
          metrics {
            timeGroup
            count
          }
        }
      }
    }
  }
`;

export const GET_EVALUATION_INSIGHTS = gql`
  query getEvaluationInsights(
    $endDate: DateTime!
    $startDate: DateTime!
    $workspaceId: String!
    $projectId: String
  ) {
    getEvaluationInsights(
      endDate: $endDate
      startDate: $startDate
      workspaceId: $workspaceId
      projectId: $projectId
    ) {
      codeQuality
      costSaved
      loc
      timeSaved
    }
  }
`;
