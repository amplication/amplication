import { gql } from "@apollo/client";
import { TEAM_FIELDS_FRAGMENT } from "../../Teams/queries/teamsQueries";

export const USER_FIELDS_FRAGMENT = gql`
  ${TEAM_FIELDS_FRAGMENT}
  fragment UserFields on User {
    id
    account {
      id
      email
      firstName
      lastName
      createdAt
    }
    teams {
      ...TeamFields
    }
  }
`;

export const GET_USER = gql`
  ${USER_FIELDS_FRAGMENT}
  query user($userId: String!) {
    user(where: { id: $userId }) {
      ...UserFields
    }
  }
`;

export const GET_CURRENT_USER = gql`
  ${USER_FIELDS_FRAGMENT}
  query getCurrentUser {
    me {
      ...UserFields
    }
  }
`;
