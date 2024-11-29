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
      blueprint {
        id
        name
        color
      }
      projectId
      properties
      owner {
        ... on User {
          id
          account {
            id
            email
            firstName
            lastName
          }
        }
        ... on Team {
          id
          name
          description
          color
        }
      }
    }
  }
`;

export const GET_RESOURCES = gql`
  query getResources($where: ResourceWhereInputWithPropertiesFilter) {
    resources(
      where: $where
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
      blueprint {
        id
        name
        color
      }
      projectId
      properties
      owner {
        ... on User {
          id
          account {
            id
            email
            firstName
            lastName
          }
        }
        ... on Team {
          id
          name
          description
          color
        }
      }
      version {
        id
        createdAt
        version
        message
      }
      serviceTemplate {
        id
        name
        projectId
      }
      serviceTemplateVersion
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
      properties
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

export const SET_RESOURCE_OWNER = gql`
  mutation setResourceOwner($data: ResourceSetOwnerInput!) {
    setResourceOwner(data: $data) {
      owner {
        ... on User {
          id
          account {
            id
            email
            firstName
            lastName
          }
        }
        ... on Team {
          id
          name
          description
          color
        }
      }
    }
  }
`;
