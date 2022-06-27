import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const CREATE_RESOURCE = gql`
  mutation createResource($data: ResourceCreateInput!) {
    createResource(data: $data) {
      id
      name
      description
      color
      githubSyncEnabled
      githubRepo
      githubBranch
      githubLastSync
      githubLastMessage
      githubTokenCreatedDate
      createdAt
      updatedAt
    }
  }
`;
export async function createResource(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
  description: string
): Promise<models.Resource> {
  const { data } = await client.mutate<{ createResource: models.Resource }>({
    mutation: CREATE_RESOURCE,
    variables: {
      data: {
        name,
        description,
      },
    },
  });

  if (!data) {
    throw new Error('no data');
  }

  return data.createResource;
}
