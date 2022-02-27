import { gql, useQuery } from "@apollo/client";
import { EnumGitProvider, GitRepo } from "../../../models";

type Props = {
  gitOrganizationId: string;
  sourceControlService: EnumGitProvider;
};

export default function useGetReposOfUser({
  gitOrganizationId,
  sourceControlService,
}: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    getReposOfOrganization: GitRepo[];
  }>(FIND_GIT_REPOS, {
    variables: {
      gitOrganizationId: gitOrganizationId,
      sourceControlService,
    },
    notifyOnNetworkStatusChange: true,
  });
  return {
    refetch,
    error,
    loading,
    networkStatus,
    repos: data?.getReposOfOrganization,
  };
}

const FIND_GIT_REPOS = gql`
  query getReposOfOrganization(
    $gitOrganizationId: String!
    $sourceControlService: EnumGitProvider!
  ) {
    getReposOfOrganization(
      gitOrganizationId: $gitOrganizationId
      sourceControlService: $sourceControlService
    ) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
