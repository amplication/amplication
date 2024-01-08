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

export const CREATE_RESOURCE_ENTITIES = gql`
  mutation copiedEntities($data: ResourcesCreateCopiedEntitiesInput!) {
    copiedEntities(data: $data) {
      id
      name
      entities {
        id
        displayName
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
