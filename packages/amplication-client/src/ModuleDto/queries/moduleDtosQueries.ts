import { gql } from "@apollo/client";
import { MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT } from "../../ModuleDtoEnumMember/queries/moduleDtosEnumMemberQueries";

export const MODULE_DTO_PROPERTY_FIELDS_FRAGMENT = gql`
  fragment ModuleDtoPropertyFields on ModuleDtoProperty {
    name
    propertyTypes {
      type
      isArray
      dtoId
    }
    isOptional
    isArray
  }
`;

export const MODULE_DTO_FIELDS_FRAGMENT = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  ${MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT}
  fragment ModuleDtoFields on ModuleDto {
    id
    name
    description
    enabled
    lockedByUserId
    lockedAt
    parentBlockId
    resourceId
    dtoType
    relatedEntityId
    properties {
      ...ModuleDtoPropertyFields
    }
    members {
      ...ModuleDtoEnumMemberFields
    }
    lockedByUser {
      account {
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_MODULE_DTO = gql`
  mutation deleteModuleDto($where: WhereUniqueInput!) {
    deleteModuleDto(where: $where) {
      id
    }
  }
`;

export const GET_MODULE_DTO = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  query moduleDto($moduleDtoId: String!) {
    moduleDto(where: { id: $moduleDtoId }) {
      ...ModuleDtoFields
    }
  }
`;

export const UPDATE_MODULE_DTO = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  mutation updateModuleDto(
    $data: ModuleDtoUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateModuleDto(data: $data, where: $where) {
      ...ModuleDtoFields
    }
  }
`;

export const CREATE_MODULE_DTO = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  mutation createModuleDto($data: ModuleDtoCreateInput!) {
    createModuleDto(data: $data) {
      ...ModuleDtoFields
    }
  }
`;

export const FIND_MODULE_DTOS = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  query moduleDtos(
    $where: ModuleDtoWhereInput
    $orderBy: ModuleDtoOrderByInput
  ) {
    moduleDtos(where: $where, orderBy: $orderBy) {
      ...ModuleDtoFields
    }
  }
`;

export const GET_AVAILABLE_DTOS_FOR_RESOURCE = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  query availableDtosForResource(
    $where: ModuleDtoWhereInput
    $orderBy: ModuleDtoOrderByInput
  ) {
    moduleDtos(where: $where, orderBy: $orderBy) {
      ...ModuleDtoFields
      parentBlock {
        id
        displayName
      }
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

export const UPDATE_MODULE_DTO_PROPERTY = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  mutation updateModuleDtoProperty(
    $where: WherePropertyUniqueInput!
    $data: ModuleDtoPropertyUpdateInput!
  ) {
    updateModuleDtoProperty(data: $data, where: $where) {
      ...ModuleDtoPropertyFields
    }
  }
`;

export const DELETE_MODULE_DTO_PROPERTY = gql`
  ${MODULE_DTO_PROPERTY_FIELDS_FRAGMENT}
  mutation deleteModuleDtoProperty($where: WherePropertyUniqueInput!) {
    deleteModuleDtoProperty(where: $where) {
      ...ModuleDtoPropertyFields
    }
  }
`;

export const CREATE_MODULE_DTO_ENUM = gql`
  ${MODULE_DTO_FIELDS_FRAGMENT}
  mutation createModuleDtoEnum($data: ModuleDtoCreateInput!) {
    createModuleDtoEnum(data: $data) {
      ...ModuleDtoFields
    }
  }
`;
