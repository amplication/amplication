import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const COMMIT_CHANGES = gql`
  mutation commit($message: String!, $appId: String!) {
    commit(data: { message: $message, app: { connect: { id: $appId } } }) {
      id
      createdAt
      userId
      message
      builds {
        id
      }
    }
  }
`;

export async function commitChanges(
  client: ApolloClient<NormalizedCacheObject>,
  appId: string,
  message: string
): Promise<models.Commit> {
  const { data } = await client.mutate<{ commit: models.Commit }>({
    mutation: COMMIT_CHANGES,
    variables: {
      message,
      appId,
    },
  });

  if (!data) {
    throw new Error('no data');
  }

  return data.commit;
}
