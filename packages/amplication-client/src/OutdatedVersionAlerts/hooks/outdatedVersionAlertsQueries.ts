import { gql } from "@apollo/client";

export const GET_OUTDATED_VERSION_ALERTS = gql`
  query getOutdatedVersionAlerts(
    $where: OutdatedVersionAlertWhereInput
    $orderBy: OutdatedVersionAlertOrderByInput
    $take: Int
    $skip: Int
  ) {
    outdatedVersionAlerts(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      id
      createdAt
      updatedAt
      resource {
        id
        name
        resourceType
      }
      resourceId
      type
      outdatedVersion
      latestVersion
      status
    }
    _outdatedVersionAlertsMeta(where: $where) {
      count
    }
  }
`;
