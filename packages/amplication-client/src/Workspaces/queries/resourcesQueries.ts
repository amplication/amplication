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
      createdAt
      updatedAt
      resourceType
      githubLastSync
      gitRepositoryOverride
      gitRepository {
        id
        name
        gitOrganization {
          id
          name
          type
        }
      }
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        version
        createdAt
        status
        commit {
          user {
            account {
              id
              lastName
              firstName
              email
            }
          }
        }
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

export const CREATE_RESOURCE_WITH_ENTITIES = gql`
  mutation createResourceWithEntities($data: ResourceCreateWithEntitiesInput!) {
    createResourceWithEntities(data: $data) {
      id
      name
      description
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
      }
    }
  }
`;

export const DISCONNECT_GIT_REPOSITORY = gql`
  mutation disconnectGitRepository($resourceId: String!) {
    disconnectResourceGitRepository(resourceId: $resourceId) {
      id
      gitRepository {
        id
      }
    }
  }
`;

export const CONNECT_RESOURCE_PROJECT_REPO = gql`
  mutation connectResourceToProjectRepository($resourceId: String!) {
    connectResourceToProjectRepository(resourceId: $resourceId) {
      id
      gitRepository {
        id
      }
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation updateResource($data: ResourceUpdateInput!, $resourceId: String!) {
    updateResource(data: $data, where: { id: $resourceId }) {
      id
      createdAt
      updatedAt
      name
      description
      gitRepositoryOverride
    }
  }
`;
