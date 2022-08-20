import { gql } from "@apollo/client";

export const GET_COMMIT_RESOURCES = gql`
  query Commit($commitId: String!) {
    commit(where: { id: $commitId }) {
      id
      message
      createdAt
      builds {
        id
        createdAt
        resource {
          id
          name
          resourceType
        }
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

export const GET_COMMITS = gql`
  query commits($projectId: String!, $orderBy: CommitOrderByInput) {
    commits(where: { project: { id: $projectId } }, orderBy: $orderBy) {
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
            resource {
              id
              name
            }
          }
          ... on Block {
            id
            displayName
            updatedAt
            resource {
              id
              name
            }
          }
        }
      }
      builds {
        id
        createdAt
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
