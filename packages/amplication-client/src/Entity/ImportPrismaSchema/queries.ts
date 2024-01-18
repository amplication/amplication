import { gql } from "@apollo/client";

export const CREATE_ENTITIES_FROM_SCHEMA = gql`
  mutation createEntitiesFromPrismaSchema(
    $data: DBSchemaImportCreateInput!
    $file: Upload!
  ) {
    createEntitiesFromPrismaSchema(data: $data, file: $file) {
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

export const CREATE_ENTITIES_FROM_PREDEFINED_SCHEMA = gql`
  mutation createEntitiesFromPredefinedSchema(
    $data: CreateEntitiesFromPredefinedSchemaInput!
  ) {
    createEntitiesFromPredefinedSchema(data: $data) {
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

export const GET_USER_ACTION = gql`
  query userAction($userActionId: String!) {
    userAction(where: { id: $userActionId }) {
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
