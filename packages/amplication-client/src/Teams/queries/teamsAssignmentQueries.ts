import { gql } from "@apollo/client";
import { ROLE_FIELDS_FRAGMENT } from "../../Roles/queries/rolesQueries";
import { TEAM_FIELDS_FRAGMENT } from "../../Teams/queries/teamsQueries";

export const TEAM_ASSIGNMENT_FIELDS_FRAGMENT = gql`
  ${ROLE_FIELDS_FRAGMENT}
  ${TEAM_FIELDS_FRAGMENT}
  fragment TeamAssignmentFields on TeamAssignment {
    id
    resourceId
    teamId
    team {
      ...TeamFields
    }
    roles {
      ...RoleFields
    }
  }
`;

export const GET_RESOURCE_TEAM_ASSIGNMENTS = gql`
  ${TEAM_ASSIGNMENT_FIELDS_FRAGMENT}
  query resourceTeamAssignments($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      teamAssignments {
        ...TeamAssignmentFields
      }
    }
  }
`;

export const CREATE_TEAM_ASSIGNMENTS = gql`
  ${TEAM_ASSIGNMENT_FIELDS_FRAGMENT}
  mutation createTeamAssignments(
    $data: CreateTeamAssignmentsInput!
    $where: CreateTeamAssignmentsWhereInput!
  ) {
    createTeamAssignments(data: $data, where: $where) {
      ...TeamAssignmentFields
    }
  }
`;

export const DELETE_TEAM_ASSIGNMENT = gql`
  ${TEAM_ASSIGNMENT_FIELDS_FRAGMENT}
  mutation deleteTeamAssignment($where: WhereTeamAssignmentInput!) {
    deleteTeamAssignment(where: $where) {
      ...TeamAssignmentFields
    }
  }
`;

export const ADD_ROLES_TO_TEAM_ASSIGNMENT = gql`
  ${TEAM_ASSIGNMENT_FIELDS_FRAGMENT}
  mutation addRolesToTeamAssignment(
    $data: TeamUpdateRolesInput!
    $where: WhereTeamAssignmentInput!
  ) {
    addRolesToTeamAssignment(data: $data, where: $where) {
      ...TeamAssignmentFields
    }
  }
`;

export const REMOVE_ROLES_FROM_TEAM_ASSIGNMENT = gql`
  ${TEAM_ASSIGNMENT_FIELDS_FRAGMENT}
  mutation removeRolesFromTeamAssignment(
    $data: TeamUpdateRolesInput!
    $where: WhereTeamAssignmentInput!
  ) {
    removeRolesFromTeamAssignment(data: $data, where: $where) {
      ...TeamAssignmentFields
    }
  }
`;
