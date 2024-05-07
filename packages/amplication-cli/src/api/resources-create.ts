import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";

import * as models from "../models";

const CREATE_RESOURCE = gql`
  mutation createService($data: ResourceCreateInput!) {
    createService(data: $data) {
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
export async function createService(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
  description: string,
  resourceType: models.EnumResourceType,
  projectId: string
): Promise<models.Resource> {
  const { data } = await client.mutate<
    { createService: models.Resource },
    models.MutationCreateServiceArgs
  >({
    mutation: CREATE_RESOURCE,
    variables: {
      data: {
        name,
        description,
        resourceType,
        project: { connect: { id: projectId } },
      },
    },
  });

  if (!data) {
    throw new Error("no data");
  }

  return data.createService;
}
