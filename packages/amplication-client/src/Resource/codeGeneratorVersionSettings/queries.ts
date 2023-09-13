import { gql } from "@apollo/client";

//// get all versions of dsg
export const GET_CODE_GENERATOR_VERSIONS = gql`
  query Versions($where: VersionWhereInput, $orderBy: [VersionOrderByInput!]) {
    versions(where: $where, orderBy: $orderBy) {
      name
      changelog
      isDeprecated
    }
  }
`;

export const GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD = gql`
  query Resource(
    $where: WhereUniqueInput!
    $orderBy: BuildOrderByInput
    $take: Int
  ) {
    resource(where: $where) {
      builds(orderBy: $orderBy, take: $take) {
        id
        codeGeneratorVersion
      }
    }
  }
`;

export const GET_CURRENT_CODE_GENERATOR_VERSION = gql`
  query GetCodeGeneratorVersion(
    $getCodeGeneratorVersionInput: GetCodeGeneratorVersionInput!
  ) {
    getCodeGeneratorVersion(
      GetCodeGeneratorVersionInput: $getCodeGeneratorVersionInput
    ) {
      name
    }
  }
`;

// update code generator version
export const UPDATE_CODE_GENERATOR_VERSION = gql`
  mutation UpdateCodeGeneratorVersion(
    $data: CodeGeneratorVersionUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateCodeGeneratorVersion(data: $data, where: $where) {
      codeGeneratorStrategy
      codeGeneratorVersion
    }
  }
`;
