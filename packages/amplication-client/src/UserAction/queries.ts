import { gql } from "@apollo/client";

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
