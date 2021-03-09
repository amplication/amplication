import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const UPDATE_APP = gql`
  mutation updateApp($data: AppUpdateInput!, $appId: String!) {
    updateApp(data: $data, where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
      color
    }
  }
`;
export async function updateApp(
  client: ApolloClient<NormalizedCacheObject>,
  appId: string,
  data: models.AppUpdateInput
): Promise<models.App> {
  const { data: appData } = await client.mutate<{ updateApp: models.App }>({
    mutation: UPDATE_APP,
    variables: {
      appId,
      data,
    },
  });

  if (!appData) {
    throw new Error('no data');
  }

  return appData.updateApp;
}
