import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser {
    me {
      account {
        id
        email
        previewAccountEmail
        previewAccountType
        firstName
        lastName
        createdAt
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount($data: UpdateAccountInput!) {
    updateAccount(data: $data) {
      firstName
      lastName
    }
  }
`;
