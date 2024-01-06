import { gql } from "@apollo/client";

export const MODULE_DTO_FIELDS_FRAGMENT = gql`
  fragment ModuleDtoFields on ModuleDto {
    id
    name
    description
    enabled
    lockedByUserId
    lockedAt
    parentBlockId
    resourceId
    properties {
      name
      propertyTypes {
        type
        isArray
        dtoId
      }
      isOptional
      isArray
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
