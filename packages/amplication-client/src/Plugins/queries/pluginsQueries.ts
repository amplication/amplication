import { gql } from "@apollo/client";

export const GET_PLUGIN_INSTALLATIONS = gql`
  query PluginInstallations($resourceId: String!) {
    PluginInstallations(
      where: { resource: { id: $resourceId } }
      orderBy: { createdAt: Asc }
    ) {
      id
      displayName
      pluginId
      enabled
      version
      settings
      configurations
    }
  }
`;

export const GET_PLUGIN_INSTALLATION = gql`
  query PluginInstallation($pluginId: String!) {
    PluginInstallation(where: { id: $pluginId }) {
      id
      displayName
      pluginId
      enabled
      version
      settings
      configurations
    }
  }
`;

export const UPDATE_PLUGIN_INSTALLATION = gql`
  mutation updatePluginInstallation(
    $data: PluginInstallationUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updatePluginInstallation(data: $data, where: $where) {
      id
      displayName
      pluginId
      enabled
      version
      settings
    }
  }
`;

export const CREATE_PLUGIN_INSTALLATION = gql`
  mutation createPluginInstallation($data: PluginInstallationCreateInput!) {
    createPluginInstallation(data: $data) {
      id
      displayName
      pluginId
      enabled
      version
      settings
    }
  }
`;

export const GET_PLUGIN_ORDER = gql`
  query pluginOrder($resourceId: String!) {
    pluginOrder(where: { id: $resourceId }) {
      order {
        pluginId
        order
      }
    }
  }
`;

export const UPDATE_PLUGIN_ORDER = gql`
  mutation setPluginOrder(
    $data: PluginSetOrderInput!
    $where: WhereUniqueInput!
  ) {
    setPluginOrder(data: $data, where: $where) {
      order {
        pluginId
        order
      }
      id
    }
  }
`;

export const GET_PLUGIN_VERSIONS_CATALOG = gql`
  query Plugins($where: PluginVersionWhereInput) {
    plugins {
      id
      pluginId
      name
      icon
      description
      taggedVersions
      npm
      github
      website
      versions(where: $where, orderBy: { createdAt: Desc }) {
        id
        pluginId
        deprecated
        isLatest
        version
        settings
        configurations
      }
    }
  }
`;
