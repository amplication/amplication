import { gql } from "@apollo/client";

export const GET_COMMITS = gql`
  query commits(
    $projectId: String!
    $take: Int!
    $skip: Int!
    $orderBy: CommitOrderByInput
  ) {
    commits(
      where: { project: { id: $projectId } }
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      user {
        id
        account {
          firstName
          lastName
        }
      }
      changes {
        originId
        action
        originType
        versionNumber
        origin {
          __typename
          ... on Entity {
            id
            displayName
            updatedAt
          }
          ... on Block {
            id
            displayName
            updatedAt
          }
        }
        resource {
          id
          name
          resourceType
        }
      }
      builds {
        id
        createdAt
        resourceId
        resource {
          id
          name
          resourceType
        }
        version
        message
        createdAt
        commitId
        commit {
          createdAt
          user {
            account {
              firstName
              lastName
            }
          }
        }
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
            logs {
              id
              createdAt
              message
              meta
              level
            }
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
  }
`;
