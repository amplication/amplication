import { gql } from "@apollo/client";

export const PRIVATE_PLUGINS_FIELDS_FRAGMENT = gql`
  fragment PrivatePluginFields on PrivatePlugin {
    id
    pluginId
    displayName
    description
    enabled
    codeGenerator
    blueprints
    icon
    color
    lockedByUserId
    lockedAt
    lockedByUser {
      account {
        firstName
        lastName
      }
    }
    versions {
      version
      deprecated
      enabled
      settings
      configurations
    }
  }
`;

export const GET_PRIVATE_PLUGINS = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  query privatePlugins(
    $where: PrivatePluginWhereInput
    $orderBy: PrivatePluginOrderByInput
  ) {
    privatePlugins(where: $where, orderBy: $orderBy) {
      ...PrivatePluginFields
    }
  }
`;

export const GET_AVAILABLE_PRIVATE_PLUGINS_FOR_RESOURCE = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  query availablePrivatePluginsForResource(
    $where: PrivatePluginWhereInput
    $orderBy: PrivatePluginOrderByInput
  ) {
    availablePrivatePluginsForResource(where: $where, orderBy: $orderBy) {
      ...PrivatePluginFields
    }
  }
`;

export const DELETE_PRIVATE_PLUGIN = gql`
  mutation deletePrivatePlugin($where: WhereUniqueInput!) {
    deletePrivatePlugin(where: $where) {
      id
    }
  }
`;

export const CREATE_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  mutation createPrivatePlugin($data: PrivatePluginCreateInput!) {
    createPrivatePlugin(data: $data) {
      ...PrivatePluginFields
    }
  }
`;

export const GET_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  query privatePlugin($privatePluginId: String!) {
    privatePlugin(where: { id: $privatePluginId }) {
      ...PrivatePluginFields
    }
  }
`;

export const UPDATE_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  mutation updatePrivatePlugin(
    $data: PrivatePluginUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updatePrivatePlugin(data: $data, where: $where) {
      ...PrivatePluginFields
    }
  }
`;

export const GET_PLUGIN_REPOSITORY_REMOTE_PLUGINS = gql`
  query pluginRepositoryRemotePlugins($where: WhereUniqueInput!) {
    pluginRepositoryRemotePlugins(where: $where) {
      content {
        name
        type
        path
      }
    }
  }
`;
