import { gql } from "@apollo/client";

export const GET_RESOURCES_FOR_MODE_ORGANIZER = gql`
  query getResourcesForModelOrganizer(
    $projectId: String!
    $whereName: StringFilter
  ) {
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
      blueprint {
        id
        name
        color
      }
      project {
        id
      }
      entities {
        id
        name
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
