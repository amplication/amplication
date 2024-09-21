import { gql } from "@apollo/client";

export const GET_RESOURCE = gql`
  query getResource($id: String!) {
    resource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      githubLastSync
      githubLastMessage
      resourceType
      licensed
    }
  }
`;

export const GET_RESOURCES = gql`
  query getResources($projectId: String!, $whereName: StringFilter) {
    resources(
      where: { project: { id: $projectId }, name: $whereName }
      orderBy: [{ resourceType: Asc }, { createdAt: Desc }]
    ) {
      id
      name
      description
      createdAt
      updatedAt
      resourceType
      githubLastSync
      gitRepositoryOverride
      codeGeneratorStrategy
      codeGeneratorVersion
      codeGenerator
      licensed
      serviceTemplate {
        id
        name
      }
      gitRepository {
        id
        name
        groupName
        baseBranchName
        gitOrganization {
          id
          name
          type
          provider
          useGroupingForRepositories
        }
      }
      entities {
        id
        name
      }
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        version
        createdAt
        status
        codeGeneratorVersion
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

export const CREATE_SERVICE_WITH_ENTITIES = gql`
  mutation createServiceWithEntities($data: ResourceCreateWithEntitiesInput!) {
    createServiceWithEntities(data: $data) {
      resource {
        id
        name
        description
        builds(orderBy: { createdAt: Desc }, take: 1) {
          id
        }
        gitRepository {
          id
          name
          groupName
          baseBranchName
          gitOrganization {
            id
            name
            provider
          }
        }
        resourceType
      }
      build {
        id
        version
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

export const CREATE_MESSAGE_BROKER = gql`
  mutation createMessageBroker($data: ResourceCreateInput!) {
    createMessageBroker(data: $data) {
      id
      name
      description
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
      }
    }
  }
`;

export const GET_MESSAGE_BROKER_CONNECTED_SERVICES = gql`
  query getMessageBrokerConnectedServices($where: WhereUniqueInput!) {
    messageBrokerConnectedServices(where: $where) {
      id
      name
      description
      resourceType
    }
  }
`;

export const DISCONNECT_GIT_REPOSITORY = gql`
  mutation disconnectGitRepository($resourceId: String!) {
    disconnectResourceGitRepository(resourceId: $resourceId) {
      id
      gitRepository {
        id
        groupName
        baseBranchName
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
        groupName
        baseBranchName
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

export const CREATE_SERVICE_FROM_TEMPLATE = gql`
  mutation createServiceFromTemplate($data: ServiceFromTemplateCreateInput!) {
    createServiceFromTemplate(data: $data) {
      id
      name
      description
    }
  }
`;
