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
      projectId
      project {
        id
        name
      }
    }
    resourceId
    blockId
    block {
      id
      displayName
    }
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

export const UPDATE_OUTDATED_VERSION_ALERT = gql`
  ${OUTDATED_VERSION_ALERT_FIELDS_FRAGMENT}
  mutation updateOutdatedVersionAlert(
    $id: String!
    $data: OutdatedVersionAlertUpdateInput!
  ) {
    updateOutdatedVersionAlert(where: { id: $id }, data: $data) {
      ...OutdatedVersionAlertFields
    }
  }
`;
