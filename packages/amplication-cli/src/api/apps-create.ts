import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
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
export async function createApp(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
  description: string
): Promise<models.App> {
  const { data } = await client.mutate<{ createApp: models.App }>({
    mutation: CREATE_APP,
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

  return data.createApp;
}
