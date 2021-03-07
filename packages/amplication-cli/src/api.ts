import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from './models';

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

const GET_APP = gql`
  query apps($id: String!) {
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
