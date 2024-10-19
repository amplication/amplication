import { gql } from "@apollo/client";

export const RESOURCE_VERSION_FRAGMENT = gql`
  fragment ResourceVersionFields on ResourceVersion {
    id
    createdAt
    version
    message
    resourceId
    createdBy {
      id
      account {
        firstName
        lastName
      }
    }
  }
`;

export const GET_RESOURCE_VERSION = gql`
  ${RESOURCE_VERSION_FRAGMENT}
  query getResourceVersion($id: String!) {
    resourceVersion(where: { id: $id }) {
      ...ResourceVersionFields
    }
  }
`;

export const GET_RESOURCE_VERSIONS = gql`
  ${RESOURCE_VERSION_FRAGMENT}
  query getResourceVersions(
    $where: ResourceVersionWhereInput
    $orderBy: ResourceVersionOrderByInput
    $take: Int
    $skip: Int
  ) {
    resourceVersions(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      ...ResourceVersionFields
    }
    _resourceVersionsMeta(where: $where) {
      count
    }
  }
`;

export const DIFF_BLOCK_VERSION_FIELDS_FRAGMENT = gql`
  fragment DiffBlockVersionFields on BlockVersion {
    id
    versionNumber
    settings
    displayName
    description
    block {
      id
      blockType
      displayName
      parentBlock {
        id
      }
    }
  }
`;

export const COMPARE_RESOURCE_VERSIONS = gql`
  ${DIFF_BLOCK_VERSION_FIELDS_FRAGMENT}

  query compareResourceVersions($where: CompareResourceVersionsWhereInput!) {
    compareResourceVersions(where: $where) {
      updatedBlocks {
        sourceBlockVersion {
          ...DiffBlockVersionFields
        }
        targetBlockVersion {
          ...DiffBlockVersionFields
        }
      }
      createdBlocks {
        ...DiffBlockVersionFields
      }
      deletedBlocks {
        ...DiffBlockVersionFields
      }
    }
  }
`;
