import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_APP = gql`
  query app($id: String!) {
    app(where: { id: $id }) {
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

export async function getApp(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<models.App> {
  const { data } = await client.query<{ app: models.App }>({
    query: GET_APP,
    variables: {
      id,
    },
  });

  return data.app;
}
