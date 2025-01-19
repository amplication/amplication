import { gql } from "@apollo/client";

export const GET_SERVICE_TEMPLATE = gql`
  query getServiceTemplate($id: String!) {
    serviceTemplate(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`;

export const GET_SERVICE_TEMPLATES = gql`
  query getServiceTemplates($projectId: String!, $whereName: StringFilter) {
    serviceTemplates(
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
      version {
        id
        version
        message
      }
    }
  }
`;

export const CREATE_SERVICE_TEMPLATE = gql`
  mutation createServiceTemplate($data: ServiceTemplateCreateInput!) {
    createServiceTemplate(data: $data) {
      id
      name
      description
      resourceType
    }
  }
`;

export const UPGRADE_SERVICE_TO_LATEST_TEMPLATE_VERSION = gql`
  mutation upgradeServiceToLatestTemplateVersion($resourceId: String!) {
    upgradeServiceToLatestTemplateVersion(where: { id: $resourceId }) {
      id
      name
      description
      resourceType
      serviceTemplateVersion
    }
  }
`;

export const GET_AVAILABLE_TEMPLATES_FOR_PROJECT = gql`
  query availableTemplatesForProject($projectId: String!) {
    availableTemplatesForProject(
      where: { id: $projectId }
      orderBy: [{ name: Asc }]
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
      blueprintId
      projectId
      project {
        id
        name
      }
      version {
        id
        version
        message
      }
    }
  }
`;

export const CREATE_TEMPLATE_FROM_RESOURCE = gql`
  mutation createTemplateFromExistingResource($resourceId: String!) {
    createTemplateFromExistingResource(
      data: { resource: { id: $resourceId } }
    ) {
      id
      name
      description
      resourceType
    }
  }
`;
