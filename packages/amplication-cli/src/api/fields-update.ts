import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const UPDATE_ENTITY_FIELD = gql`
  mutation updateEntityField(
    $data: EntityFieldUpdateInput!
    $where: WhereUniqueInput!
    $relatedFieldName: String
    $relatedFieldDisplayName: String
  ) {
    updateEntityField(
      data: $data
      where: $where
      relatedFieldName: $relatedFieldName
      relatedFieldDisplayName: $relatedFieldDisplayName
    ) {
      id
      createdAt
      updatedAt
      name
      displayName
      dataType
      properties
      required
      searchable
      description
    }
  }
`;

export async function updateField(
  client: ApolloClient<NormalizedCacheObject>,
  data: models.EntityFieldUpdateInput,
  where: models.WhereUniqueInput,
  relatedFieldName?: string | undefined,
  relatedFieldDisplayName?: string | undefined
): Promise<models.EntityField> {
  const { data: fieldData } = await client.mutate<{
    updateEntityField: models.EntityField;
  }>({
    mutation: UPDATE_ENTITY_FIELD,
    variables: {
      data,
      where,
      relatedFieldName,
      relatedFieldDisplayName,
    },
  });

  if (!fieldData) {
    throw new Error("no data");
  }

  return fieldData.updateEntityField;
}
