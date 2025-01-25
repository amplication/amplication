import { gql } from "@apollo/client";

export const RESOURCE_FIELDS_FRAGMENT = gql`
  fragment ResourceFields on Resource {
    id
    createdAt
    updatedAt
    name
    description
    githubLastSync
    githubLastMessage
    gitRepositoryOverride
    resourceType
    licensed
    blueprintId
    blueprint {
      id
      name
      color
    }
    projectId
    properties
    settings {
      id
      properties
    }
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
`;

export const GET_RESOURCE = gql`
  ${RESOURCE_FIELDS_FRAGMENT}
  query getResource($id: String!) {
    resource(where: { id: $id }) {
      ...ResourceFields
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
      blueprintId
      blueprint {
        id
        name
        color
        resourceType
        codeGenerator
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
  ${RESOURCE_FIELDS_FRAGMENT}
  mutation updateResource($data: ResourceUpdateInput!, $resourceId: String!) {
    updateResource(data: $data, where: { id: $resourceId }) {
      ...ResourceFields
    }
  }
`;

export const UPDATE_RESOURCE_SETTINGS = gql`
  ${RESOURCE_FIELDS_FRAGMENT}
  mutation updateResourceSettings(
    $data: ResourceSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateResourceSettings(data: $data, where: { id: $resourceId }) {
      ...ResourceFields
    }
  }
`;

export const CREATE_SERVICE_FROM_TEMPLATE = gql`
  mutation createServiceFromTemplate($data: ResourceFromTemplateCreateInput!) {
    createResourceFromTemplate(data: $data) {
      id
      name
      description
    }
  }
`;

export const SET_RESOURCE_OWNER = gql`
  ${RESOURCE_FIELDS_FRAGMENT}
  mutation setResourceOwner($data: ResourceSetOwnerInput!) {
    setResourceOwner(data: $data) {
      ...ResourceFields
    }
  }
`;
