import { gql } from "@apollo/client";

export const UPDATE_RESOURCE_SETTINGS = gql`
  mutation updateResourceSettings(
    $data: ResourceSettingsUpdateInput!
    $resourceId: String!
  ) {
    updateResourceSettings(data: $data, where: { id: $resourceId }) {
      id
      properties
    }
  }
`;
