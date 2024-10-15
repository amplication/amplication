import { gql } from "@apollo/client";

export const PRIVATE_PLUGIN_VERSION_FIELDS_FRAGMENT = gql`
  fragment PrivatePluginVersionFields on PrivatePluginVersion {
    version
    deprecated
    enabled
    settings
    configurations
  }
`;

export const CREATE_PRIVATE_PLUGIN_VERSION = gql`
  ${PRIVATE_PLUGIN_VERSION_FIELDS_FRAGMENT}
  mutation createPrivatePluginVersion($data: PrivatePluginVersionCreateInput!) {
    createPrivatePluginVersion(data: $data) {
      ...PrivatePluginVersionFields
    }
  }
`;

export const UPDATE_PRIVATE_PLUGIN_VERSION = gql`
  ${PRIVATE_PLUGIN_VERSION_FIELDS_FRAGMENT}
  mutation updatePrivatePluginVersion(
    $where: WherePrivatePluginVersionUniqueInput!
    $data: PrivatePluginVersionUpdateInput!
  ) {
    updatePrivatePluginVersion(data: $data, where: $where) {
      ...PrivatePluginVersionFields
    }
  }
`;
