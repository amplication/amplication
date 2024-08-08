import { gql } from "@apollo/client";

export const PACKAGE_FIELDS_FRAGMENT = gql`
  fragment PackageFields on Package {
    id
    displayName
    summary
  }
`;

export const CREATE_PACKAGE = gql`
  ${PACKAGE_FIELDS_FRAGMENT}
  mutation createPackage($data: PackageCreateInput!) {
    createPackage(data: $data) {
      ...PackageFields
    }
  }
`;

export const FIND_PACKAGES = gql`
  ${PACKAGE_FIELDS_FRAGMENT}
  query packages($where: PackageWhereInput, $orderBy: PackageOrderByInput) {
    packageList(where: $where, orderBy: $orderBy) {
      ...PackageFields
    }
  }
`;

export const GET_PACKAGE = gql`
  ${PACKAGE_FIELDS_FRAGMENT}
  query package($packageId: String!) {
    package(where: { id: $packageId }) {
      ...PackageFields
    }
  }
`;

export const UPDATE_PACKAGE = gql`
  ${PACKAGE_FIELDS_FRAGMENT}
  mutation updatePackage(
    $data: PackageUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updatePackage(data: $data, where: $where) {
      ...PackageFields
    }
  }
`;

export const DELETE_PACKAGE = gql`
  mutation deletePackage($where: WhereUniqueInput!) {
    deletePackage(where: $where) {
      id
    }
  }
`;
