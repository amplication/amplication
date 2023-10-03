import { gql } from "@apollo/client";

export const GET_CURRENT_PROJECT = gql`
  query findProject($projectId: String!) {
    project(where: { id: $projectId }) {
      id
      name
      resources {
        id
      }
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query findProjects {
    projects {
      id
      name
      description
      useDemoRepo
      demoRepoName
      resources {
        id
        name
        resourceType
        gitRepository {
          id
          name
          groupName
          baseBranchName
          gitOrganizationId
          gitOrganization {
            provider
          }
        }
      }
      createdAt
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation createProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
      id
      name
    }
  }
`;

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChanges($projectId: String!) {
    pendingChanges(where: { project: { id: $projectId } }) {
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
          lockedByUser {
            account {
              firstName
              lastName
            }
          }
        }
        ... on Block {
          id
          displayName
          updatedAt
          blockType
        }
      }
      resource {
        id
        name
        resourceType
      }
    }
  }
`;
