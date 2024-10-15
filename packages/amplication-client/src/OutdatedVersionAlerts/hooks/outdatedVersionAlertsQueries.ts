import { gql } from "@apollo/client";

export const OUTDATED_VERSION_ALERT_FIELDS_FRAGMENT = gql`
  fragment OutdatedVersionAlertFields on OutdatedVersionAlert {
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
`;

export const GET_OUTDATED_VERSION_ALERTS = gql`
  ${OUTDATED_VERSION_ALERT_FIELDS_FRAGMENT}
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
      ...OutdatedVersionAlertFields
    }
    _outdatedVersionAlertsMeta(where: $where) {
      count
    }
  }
`;

export const GET_OUTDATED_VERSION_ALERT = gql`
  ${OUTDATED_VERSION_ALERT_FIELDS_FRAGMENT}
  query getOutdatedVersionAlert($alertId: String!) {
    outdatedVersionAlert(where: { id: $alertId }) {
      ...OutdatedVersionAlertFields
    }
  }
`;
