import { gql } from "@apollo/client";

export const MODULE_DTO_PROPERTY_FIELDS_FRAGMENT = gql`
  fragment ModuleDtoPropertyFields on ModuleDtoProperty {
    id
    name
    description
    propertyType
    isOptional
    isArray
    lockedByUserId
    lockedAt
    parentBlockId
    lockedByUser {
      account {
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_MODULE_DTO_PROPERTY = gql`
  mutation deleteModuleDtoProperty($where: WhereUniqueInput!) {
    deleteModuleDtoProperty(where: $where) {
      id
      parentBlockId
    }
  }
`;

export const GET_MODULE_DTO_PROPERTY = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  query ModuleDtoProperty($moduleDtoPropertyId: String!) {
    ModuleDtoProperty(where: { id: $moduleDtoPropertyId }) {
      ...ModuleDtoPropertyFields
    }
  }
`;

export const UPDATE_MODULE_DTO_PROPERTY = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  mutation updateModuleDtoProperty(
    $data: ModuleDtoPropertyUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateModuleDtoProperty(data: $data, where: $where) {
      ...ModuleDtoPropertyFields
    }
  }
`;

export const CREATE_MODULE_DTO_PROPERTY = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  mutation createModuleDtoProperty($data: ModuleDtoPropertyCreateInput!) {
    createModuleDtoProperty(data: $data) {
      ...ModuleDtoPropertyFields
    }
  }
`;

export const FIND_MODULE_DTO_PROPERTIES = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  query ModuleDtoProperties(
    $where: ModuleDtoPropertyWhereInput
    $orderBy: ModuleDtoPropertyOrderByInput
  ) {
    ModuleDtoPropertys(where: $where, orderBy: $orderBy) {
      ...ModuleDtoPropertyFields
    }
  }
`;
