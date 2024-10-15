import { gql } from "@apollo/client";

export const GET_RESOURCE_VERSION = gql`
  query getResourceVersion($id: String!) {
    resourceVersion(where: { id: $id }) {
      id
      createdAt
      version
      message
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_RESOURCE_VERSIONS = gql`
  query getResourceVersions(
    $where: ResourceVersionWhereInput
    $orderBy: ResourceVersionOrderByInput
    $take: Int
    $skip: Int
  ) {
    resourceVersions(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      id
      createdAt
      version
      message
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
    }
    _resourceVersionsMeta(where: $where) {
      count
    }
  }
`;
