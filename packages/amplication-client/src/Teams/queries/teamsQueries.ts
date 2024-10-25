import { gql } from "@apollo/client";

export const TEAM_FIELDS_FRAGMENT = gql`
  fragment TeamFields on Team {
    id
    name
    description
  }
`;

export const DELETE_TEAM = gql`
  mutation deleteTeam($where: WhereUniqueInput!) {
    deleteTeam(where: $where) {
      id
    }
  }
`;

export const GET_TEAM = gql`
  ${TEAM_FIELDS_FRAGMENT}
  query team($teamId: String!) {
    team(where: { id: $teamId }) {
      ...TeamFields
    }
  }
`;

export const UPDATE_TEAM = gql`
  ${TEAM_FIELDS_FRAGMENT}
  mutation updateTeam($data: TeamUpdateInput!, $where: WhereUniqueInput!) {
    updateTeam(data: $data, where: $where) {
      ...TeamFields
    }
  }
`;

export const CREATE_TEAM = gql`
  ${TEAM_FIELDS_FRAGMENT}
  mutation createTeam($data: TeamCreateInput!) {
    createTeam(data: $data) {
      ...TeamFields
    }
  }
`;

export const FIND_TEAMS = gql`
  ${TEAM_FIELDS_FRAGMENT}
  query teams($where: TeamWhereInput, $orderBy: TeamOrderByInput) {
    teams(where: $where, orderBy: $orderBy) {
      ...TeamFields
    }
  }
`;
