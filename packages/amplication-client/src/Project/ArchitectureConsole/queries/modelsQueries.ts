import { gql } from "@apollo/client";

export const GET_RESOURCES = gql`
  query getResources($projectId: String!, $whereName: StringFilter) {
    resources(
      where: {
        project: { id: $projectId }
        resourceType: { equals: Service }
        name: $whereName
      }
      orderBy: { createdAt: Asc }
    ) {
      id
      name
      description
      resourceType
      project {
        id
      }
      entities {
        id
        displayName
        description
        resourceId
        fields {
          permanentId
          displayName
          description
          properties
          dataType
          customAttributes
          required
          unique
        }
      }
    }
  }
`;

export const REDESIGN_PROJECT = gql`
  mutation redesignProject($data: RedesignProjectInput!) {
    redesignProject(data: $data) {
      id
      createdAt
      actionId
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
`;

export const START_REDESIGN = gql`
  mutation startRedesign($data: WhereUniqueInput!) {
    startRedesign(data: $data) {
      name
    }
  }
`;
