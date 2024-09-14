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
      entities {
        id
        name
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
