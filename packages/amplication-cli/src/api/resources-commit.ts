import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const COMMIT_CHANGES = gql`
  mutation commit($message: String!, $resourceId: String!) {
    commit(
      data: { message: $message, resource: { connect: { id: $resourceId } } }
    ) {
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
  resourceId: string,
  message: string
): Promise<models.Commit> {
  const { data } = await client.mutate<{ commit: models.Commit }>({
    mutation: COMMIT_CHANGES,
    variables: {
      message,
      resourceId,
    },
  });

  if (!data) {
    throw new Error('no data');
  }

  return data.commit;
}
