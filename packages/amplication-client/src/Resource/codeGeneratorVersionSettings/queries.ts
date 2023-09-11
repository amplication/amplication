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

// get the current latest dsg version
export const GET_CODE_GENERATOR_VERSION = gql`
  query GetCodeGeneratorVersion(
    $getCodeGeneratorVersionInput: GetCodeGeneratorVersionInput!
  ) {
    getCodeGeneratorVersion(
      GetCodeGeneratorVersionInput: $getCodeGeneratorVersionInput
    ) {
      name
      changelog
      isDeprecated
    }
  }
`;

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
