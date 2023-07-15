import { gql } from "@apollo/client";

export const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitResourceInstallationUrl($gitProvider: EnumGitProvider!) {
    getGitResourceInstallationUrl(data: { gitProvider: $gitProvider }) {
      url
    }
  }
`;

export const CONNECT_GIT_PROVIDER_REPOSITORY = gql`
  mutation connectGitRepository(
    $gitProvider: EnumGitProvider!
    $gitOrganizationId: String!
    $resourceId: String
    $name: String!
    $isPublic: Boolean!
    $groupName: String
  ) {
    connectGitRepository(
      data: {
        name: $name
        isPublic: $isPublic
        gitOrganizationId: $gitOrganizationId
        resourceId: $resourceId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
        groupName: $groupName
      }
    ) {
      gitRepository {
        id
        groupName
        baseBranchName
      }
    }
  }
`;

export const CONNECT_GIT_REPOSITORY = gql`
  mutation connectResourceGitRepository(
    $name: String!
    $gitOrganizationId: String!
    $resourceId: String!
    $groupName: String
  ) {
    connectResourceGitRepository(
      data: {
        name: $name
        resourceId: $resourceId
        gitOrganizationId: $gitOrganizationId
        groupName: $groupName
      }
    ) {
      id
      gitRepository {
        id
        groupName
        baseBranchName
      }
    }
  }
`;

export const FIND_GIT_REPOS = gql`
  query remoteGitRepositories(
    $groupName: String
    $gitOrganizationId: String!
    $gitProvider: EnumGitProvider!
    $perPage: Float!
    $page: Float!
  ) {
    remoteGitRepositories(
      where: {
        groupName: $groupName
        gitOrganizationId: $gitOrganizationId
        gitProvider: $gitProvider
        perPage: $perPage
        page: $page
      }
    ) {
      repos {
        name
        url
        private
        fullName
        admin
        groupName
      }
      total
      pagination {
        page
        perPage
      }
    }
  }
`;

export const GET_GROUPS = gql`
  query gitGroups($organizationId: String!) {
    gitGroups(where: { organizationId: $organizationId }) {
      total
      page
      pageSize
      groups {
        id
        name
        displayName
      }
    }
  }
`;

export const UPDATE_GIT_REPOSITORY = gql`
  mutation updateGitRepository(
    $data: GitRepositoryUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateGitRepository(data: $data, where: $where) {
      id
      groupName
      baseBranchName
    }
  }
`;
