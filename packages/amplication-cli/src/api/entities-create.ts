import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
      name
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

export async function createEntity(
  client: ApolloClient<NormalizedCacheObject>,
  data: models.EntityCreateInput
): Promise<models.Entity> {
  const { data: entityData } = await client.mutate<{
    createOneEntity: models.Entity;
  }>({
    mutation: CREATE_ENTITY,
    variables: {
      data,
    },
  });

  if (!entityData) {
    throw new Error('no data');
  }

  return entityData?.createOneEntity;
}
