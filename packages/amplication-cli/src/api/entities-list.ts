import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_ENTITIES = gql`
  query getEntities(
    $appId: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { app: { id: $appId }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      appId
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
  appId: string,
  orderBy: string | undefined,
  whereName: string | undefined
): Promise<models.Entity[]> {
  const { data } = await client.query<{ entities: models.Entity[] }>({
    query: GET_ENTITIES,
    variables: {
      appId,
      orderBy,
      whereName,
    },
  });

  return data.entities;
}
