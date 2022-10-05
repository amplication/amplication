import { gql } from "@apollo/client";

export const GET_LAST_BUILD = gql`
  query lastBuild($resourceId: String!) {
    builds(
      where: { resource: { id: $resourceId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      createdAt
      resourceId
      version
      message
      createdAt
      commitId
      actionId
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
        }
      }
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURI
    }
  }
`;
