import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_APPS = gql`
  query apps {
    apps {
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

export async function getApps(
  client: ApolloClient<NormalizedCacheObject>
): Promise<models.App[]> {
  const { data } = await client.query<{ apps: models.App[] }>({
    query: GET_APPS,
  });

  return data.apps;
}
