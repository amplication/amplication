import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const GET_RESOURCES = gql`
  query resources {
    resources {
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

export async function getResources(
  client: ApolloClient<NormalizedCacheObject>
): Promise<models.Resource[]> {
  const { data } = await client.query<{ resources: models.Resource[] }>({
    query: GET_RESOURCES,
  });

  return data.resources;
}
