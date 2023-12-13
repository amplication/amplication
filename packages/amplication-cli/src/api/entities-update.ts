import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!, $where: WhereUniqueInput!) {
    updateEntity(data: $data, where: $where) {
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
    throw new Error("no data");
  }

  return entityData?.updateEntity;
}
