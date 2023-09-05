import { gql } from "@apollo/client";

export const CREATE_GIT_ORGANIZATION_GITHUB = gql`
  mutation createOrganizationGitHub(
    $installationId: String!
    $gitProvider: EnumGitProvider!
  ) {
    createOrganization(
      data: {
        gitProvider: $gitProvider
        githubInput: { installationId: $installationId }
      }
    ) {
      id
      name
    }
  }
`;

export const CREATE_GIT_ORGANIZATION_AWS_CODECOMMIT = gql`
  mutation createOrganizationAwsCodeCommit(
    $gitProvider: EnumGitProvider!
    $accessKeyId: String!
    $accessKeySecret: String!
    $gitPassword: String!
    $region: String!
    $gitUsername: String!
  ) {
    createOrganization(
      data: {
        gitProvider: $gitProvider
        awsCodeCommitInput: {
          accessKeyId: $accessKeyId
          accessKeySecret: $accessKeySecret
          gitPassword: $gitPassword
          region: $region
          gitUsername: $gitUsername
        }
      }
    ) {
      id
      name
    }
  }
`;

export const CREATE_GIT_ORGANIZATION_OAUTH2_FLOW = gql`
  mutation completeGitOAuth2Flow(
    $code: String!
    $gitProvider: EnumGitProvider!
  ) {
    completeGitOAuth2Flow(data: { code: $code, gitProvider: $gitProvider }) {
      id
      name
    }
  }
`;
