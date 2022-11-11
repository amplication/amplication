import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_FIELDS = gql`
  query getEntityFields(
    $entityId: String!
    $orderBy: EntityFieldOrderByInput
    $whereName: StringFilter
  ) {
    entity(where: { id: $entityId }) {
      id
      resourceId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
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
  }
`;

export async function getFields(
  client: ApolloClient<NormalizedCacheObject>,
  entityId: string,
  orderBy: string | undefined,
  whereName: string | undefined
): Promise<models.EntityField[]> {
  const { data } = await client.query<{
    entity: models.Entity;
  }>({
    query: GET_FIELDS,
    variables: {
      entityId,
      orderBy,
      whereName,
    },
  });

  return data.entity.fields || [];
}
