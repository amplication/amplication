import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!, $where: WhereUniqueInput!) {
    updateEntity(data: $data, where: $where) {
      id
      name
      appId
      displayName
      description
      lockedByUserId
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
      versions(take: 1, orderBy: { versionNumber: Desc }) {
        versionNumber
        commit {
          userId
          message
          createdAt
          user {
            id
            account {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;

export async function updateEntity(
  client: ApolloClient<NormalizedCacheObject>,
  data: models.EntityUpdateInput,
  where: models.WhereUniqueInput
): Promise<models.Entity> {
  const { data: entityData } = await client.mutate<{
    updateEntity: models.Entity;
  }>({
    mutation: UPDATE_ENTITY,
    variables: {
      data,
      where,
    },
  });

  if (!entityData) {
    throw new Error('no data');
  }

  return entityData?.updateEntity;
}
