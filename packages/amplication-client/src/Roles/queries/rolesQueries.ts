import { gql } from "@apollo/client";

export const ROLE_FIELDS_FRAGMENT = gql`
  fragment RoleFields on Role {
    id
    name
    key
    description
    permissions
  }
`;

export const DELETE_ROLE = gql`
  mutation deleteRole($where: WhereUniqueInput!) {
    deleteRole(where: $where) {
      id
    }
  }
`;

export const GET_ROLE = gql`
  ${ROLE_FIELDS_FRAGMENT}
  query role($roleId: String!) {
    role(where: { id: $roleId }) {
      ...RoleFields
    }
  }
`;

export const UPDATE_ROLE = gql`
  ${ROLE_FIELDS_FRAGMENT}
  mutation updateRole($data: RoleUpdateInput!, $where: WhereUniqueInput!) {
    updateRole(data: $data, where: $where) {
      ...RoleFields
    }
  }
`;

export const CREATE_ROLE = gql`
  ${ROLE_FIELDS_FRAGMENT}
  mutation createRole($data: RoleCreateInput!) {
    createRole(data: $data) {
      ...RoleFields
    }
  }
`;

export const FIND_ROLES = gql`
  ${ROLE_FIELDS_FRAGMENT}
  query roles($where: RoleWhereInput, $orderBy: RoleOrderByInput) {
    roles(where: $where, orderBy: $orderBy) {
      ...RoleFields
    }
  }
`;

export const ADD_PERMISSIONS_TO_ROLE = gql`
  ${ROLE_FIELDS_FRAGMENT}
  mutation addRolePermissions(
    $data: RoleAddRemovePermissionsInput!
    $where: WhereUniqueInput!
  ) {
    addRolePermissions(data: $data, where: $where) {
      ...RoleFields
    }
  }
`;

export const REMOVE_PERMISSIONS_FROM_ROLE = gql`
  ${ROLE_FIELDS_FRAGMENT}
  mutation removeRolePermissions(
    $data: RoleAddRemovePermissionsInput!
    $where: WhereUniqueInput!
  ) {
    removeRolePermissions(data: $data, where: $where) {
      ...RoleFields
    }
  }
`;
