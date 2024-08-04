import { gql } from "@apollo/client";

export const CREATE_PLUGIN_REPOSITORY = gql`
  mutation createPluginRepository($data: ResourceCreateInput!) {
    createPluginRepository(data: $data) {
      id
      name
      description
    }
  }
`;
