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
  query getResourceVersions($resourceId: String!, $whereName: StringFilter) {
    resourceVersions(
      where: { resource: { id: $resourceId }, message: $whereName }
      orderBy: { createdAt: Desc }
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
  }
`;
