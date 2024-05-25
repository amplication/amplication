import { gql } from "@apollo/client";

export const MODULE_FIELDS_FRAGMENT = gql`
  fragment ModuleFields on Module {
    id
    name
    enabled
    displayName
    description
    entityId
    lockedByUserId
    lockedAt
    resourceId
    lockedByUser {
      account {
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_MODULE = gql`
  mutation deleteModule($where: WhereUniqueInput!) {
    deleteModule(where: $where) {
      id
    }
  }
`;

export const GET_MODULE = gql`
  ${MODULE_FIELDS_FRAGMENT}
  query module($moduleId: String!) {
    module(where: { id: $moduleId }) {
      ...ModuleFields
    }
  }
`;

export const UPDATE_MODULE = gql`
  ${MODULE_FIELDS_FRAGMENT}
  mutation updateModule($data: ModuleUpdateInput!, $where: WhereUniqueInput!) {
    updateModule(data: $data, where: $where) {
      ...ModuleFields
    }
  }
`;

export const CREATE_MODULE = gql`
  ${MODULE_FIELDS_FRAGMENT}
  mutation createModule($data: ModuleCreateInput!) {
    createModule(data: $data) {
      ...ModuleFields
    }
  }
`;

export const FIND_MODULES = gql`
  ${MODULE_FIELDS_FRAGMENT}
  query modules($where: ModuleWhereInput, $orderBy: ModuleOrderByInput) {
    modules(where: $where, orderBy: $orderBy) {
      ...ModuleFields
    }
  }
`;
