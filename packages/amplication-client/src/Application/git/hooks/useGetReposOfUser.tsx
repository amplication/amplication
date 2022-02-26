import { gql, useQuery } from "@apollo/client";
import { EnumSourceControlService, GitRepo } from "../../../models";

type Props = {
  gitOrganizationId: string;
  sourceControlService: EnumSourceControlService;
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
    $sourceControlService: EnumSourceControlService!
  ) {
    getReposOfOrganization(gitOrganizationId: $gitOrganizationId, sourceControlService: $sourceControlService) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
