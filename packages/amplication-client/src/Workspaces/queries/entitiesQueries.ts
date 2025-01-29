import { gql } from "@apollo/client";

export const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
      name
      fields {
        id
        name
        dataType
      }
    }
  }
`;

export const CREATE_DEFAULT_ENTITIES = gql`
  mutation createDefaultAuthEntity($data: DefaultEntitiesInput!) {
    createDefaultAuthEntity(data: $data) {
      id
      displayName
      name
    }
  }
`;

export const NEW_ENTITY_FRAGMENT = gql`
  fragment NewEntity on Entity {
    id
    name
    fields {
      id
      name
      dataType
    }
  }
`;
