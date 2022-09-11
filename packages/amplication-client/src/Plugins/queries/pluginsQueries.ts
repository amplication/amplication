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
    }
  }
`;
