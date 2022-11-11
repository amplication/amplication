import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_ENTITIES = gql`
  query getEntities(
    $resourceId: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { resource: { id: $resourceId }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      resourceId
      displayName
      pluralDisplayName
      description
      lockedByUserId
      lockedAt
      createdAt
      updatedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
    }
  }
`;

export async function getEntities(
  client: ApolloClient<NormalizedCacheObject>,
  resourceId: string,
  orderBy: string | undefined,
  whereName: string | undefined
): Promise<models.Entity[]> {
  const { data } = await client.query<{ entities: models.Entity[] }>({
    query: GET_ENTITIES,
    variables: {
      resourceId,
      orderBy,
      whereName,
    },
  });

  return data.entities;
}
