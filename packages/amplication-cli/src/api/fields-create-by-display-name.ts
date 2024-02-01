import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityFieldByDisplayName(
    $data: EntityFieldCreateByDisplayNameInput!
  ) {
    createEntityFieldByDisplayName(data: $data) {
      id
      displayName
      createdAt
      updatedAt
      name
      dataType
      required
      searchable
      description
      properties
    }
  }
`;

export async function createFieldByDisplayName(
  client: ApolloClient<NormalizedCacheObject>,
  data: models.EntityFieldCreateByDisplayNameInput
): Promise<models.EntityField> {
  const { data: fieldData } = await client.mutate<{
    createEntityFieldByDisplayName: models.EntityField;
  }>({
    mutation: CREATE_ENTITY_FIELD,
    variables: {
      data,
    },
  });

  if (!fieldData) {
    throw new Error("no data");
  }

  return fieldData.createEntityFieldByDisplayName;
}
