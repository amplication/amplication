import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const GET_RESOURCE = gql`
  query resource($id: String!) {
    resource(where: { id: $id }) {
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

export async function getResource(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<models.Resource> {
  const { data } = await client.query<{ resource: models.Resource }>({
    query: GET_RESOURCE,
    variables: {
      id,
    },
  });

  return data.resource;
}
