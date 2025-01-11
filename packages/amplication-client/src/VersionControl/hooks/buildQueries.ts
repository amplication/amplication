import { gql } from "@apollo/client";

export const GET_LAST_SUCCESSFUL_GIT_BUILD = gql`
  query lastSuccessfulGitBuild($resourceId: String!) {
    builds(
      where: { resource: { id: $resourceId }, gitStatus: { equals: Completed } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      createdAt
      resourceId
      version
      message
      createdAt
      commitId
      actionId
      status
      gitStatus
      buildPlugins {
        id
        packageName
        packageVersion
        requestedFullPackageName
        createdAt
      }
    }
  }
`;
