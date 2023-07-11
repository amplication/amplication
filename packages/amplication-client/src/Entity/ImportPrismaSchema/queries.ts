import { gql } from "@apollo/client";

export const CREATE_ENTITIES_FORM_SCHEMA = gql`
  mutation createEntitiesFromPrismaSchema(
    $data: UserActionCreateInput!
    $file: Upload!
  ) {
    createEntitiesFromPrismaSchema(data: $data, file: $file) {
      id
      createdAt
      actionId
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
