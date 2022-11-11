import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client/core';

import * as models from '../models';

const UPDATE_RESOURCE = gql`
  mutation updateResource($data: ResourceUpdateInput!, $resourceId: String!) {
    updateResource(data: $data, where: { id: $resourceId }) {
      id
      createdAt
      updatedAt
      name
      description
      color
    }
  }
`;
export async function updateResource(
  client: ApolloClient<NormalizedCacheObject>,
  resourceId: string,
  data: models.ResourceUpdateInput
): Promise<models.Resource> {
  const { data: resourceData } = await client.mutate<{
    updateResource: models.Resource;
  }>({
    mutation: UPDATE_RESOURCE,
    variables: {
      resourceId,
      data,
    },
  });

  if (!resourceData) {
    throw new Error('no data');
  }

  return resourceData.updateResource;
}
