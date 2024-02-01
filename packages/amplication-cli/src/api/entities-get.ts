import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
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

export async function getEntity(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<models.Entity> {
  const { data } = await client.query<{
    entity: models.Entity;
  }>({
    query: GET_ENTITY,
    variables: {
      id,
    },
  });

  return data.entity;
}
