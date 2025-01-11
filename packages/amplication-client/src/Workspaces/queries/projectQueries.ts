import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query findProjects {
    projects {
      id
      name
      description
      useDemoRepo
      demoRepoName
      licensed
      platformIsPublic
      resources {
        id
        name
        resourceType
        licensed
        gitRepositoryOverride
        gitRepository {
          id
          name
          groupName
          baseBranchName
          gitOrganizationId
          gitOrganization {
            provider
            name
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
  query pendingChanges(
    $projectId: String!
    $resourceTypeGroup: EnumResourceTypeGroup!
  ) {
    pendingChanges(
      where: {
        project: { id: $projectId }
        resourceTypeGroup: $resourceTypeGroup
      }
    ) {
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
          parentBlock {
            id
            displayName
          }
        }
      }
      resource {
        id
        name
        resourceType
        licensed
        blueprint {
          id
          name
          color
        }
        version {
          id
          version
          message
        }
      }
    }
  }
`;
