import { gql } from "@apollo/client";

export const MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT = gql`
  fragment ModuleDtoEnumMemberFields on ModuleDtoEnumMember {
    name
    value
  }
`;

export const CREATE_MODULE_DTO_ENUM_MEMBER = gql`
  ${MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT}
  mutation createModuleDtoEnumMember($data: ModuleDtoEnumMemberCreateInput!) {
    createModuleDtoEnumMember(data: $data) {
      ...ModuleDtoEnumMemberFields
    }
  }
`;

export const UPDATE_MODULE_DTO_ENUM_MEMBER = gql`
  ${MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT}
  mutation updateModuleDtoEnumMember(
    $where: WhereEnumMemberUniqueInput!
    $data: ModuleDtoEnumMemberUpdateInput!
  ) {
    updateModuleDtoEnumMember(data: $data, where: $where) {
      ...ModuleDtoEnumMemberFields
    }
  }
`;

export const DELETE_MODULE_DTO_ENUM_MEMBER = gql`
  ${MODULE_DTO_ENUM_MEMBER_FIELDS_FRAGMENT}
  mutation deleteModuleDtoEnumMember($where: WhereEnumMemberUniqueInput!) {
    deleteModuleDtoEnumMember(where: $where) {
      ...ModuleDtoEnumMemberFields
    }
  }
`;
