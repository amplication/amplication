import { gql } from "@apollo/client";

export const CREATE_GIT_ORGANIZATION = gql`
  mutation createOrganization(
    $installationId: String!
    $gitProvider: EnumGitProvider!
  ) {
    createOrganization(
      data: { installationId: $installationId, gitProvider: $gitProvider }
    ) {
      id
      name
    }
  }
`;

export const COMPLETE_OAUTH2_FLOW = gql`
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
