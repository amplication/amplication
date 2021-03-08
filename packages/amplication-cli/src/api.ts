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

const GET_ENTITIES = gql`
  query getEntities(
    $appId: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { app: { id: $appId }, displayName: $whereName }
      orderBy: $orderBy
    ) {
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

export async function getEntities(
  client: ApolloClient<NormalizedCacheObject>,
  appId: string,
  orderBy: string | undefined,
  whereName: string | undefined
): Promise<models.Entity[]> {
  const { data } = await client.query<{ entities: models.Entity[] }>({
    query: GET_ENTITIES,
    variables: {
      appId,
      orderBy,
      whereName,
    },
  });

  return data.entities;
}

const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
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

export async function getEntity(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<models.Entity> {
  const { data } = await client.query<{
    entity: models.Entity;
  }>({
    query: GET_ENTITY,
    variables: {
      id,
    },
  });

  return data.entity;
}

const GET_FIELDS = gql`
  query getEntityFields(
    $entityId: String!
    $orderBy: EntityFieldOrderByInput
    $whereName: StringFilter
  ) {
    entity(where: { id: $entityId }) {
      id
      appId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
        id
        displayName
        name
        dataType
        required
        searchable
        description
        properties
      }
    }
  }
`;

export async function getFields(
  client: ApolloClient<NormalizedCacheObject>,
  entityId: string,
  orderBy: string | undefined,
  whereName: string | undefined
): Promise<models.EntityField[]> {
  const { data } = await client.query<{
    entity: models.Entity;
  }>({
    query: GET_FIELDS,
    variables: {
      entityId,
      orderBy,
      whereName,
    },
  });

  return data.entity.fields || [];
}
