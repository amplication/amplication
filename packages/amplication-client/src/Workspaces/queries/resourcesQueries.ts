import { gql } from "@apollo/client";

export const GET_RESOURCES = gql`
  query getResources($projectId: String!, $whereName: StringFilter) {
    resources(
      where: { project: { id: $projectId }, name: $whereName }
      orderBy: { createdAt: Desc }
    ) {
      id
      name
      description
      color
      updatedAt
      resourceType
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        version
        createdAt
        status
        action {
          id
          createdAt
          steps {
            id
            name
            createdAt
            message
            status
            completedAt
            logs {
              id
              createdAt
              message
              meta
              level
            }
          }
        }
      }
    }
  }
`;
