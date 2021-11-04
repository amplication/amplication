import { gql, useQuery } from "@apollo/client";
import { EnumSourceControlService, GitRepo } from "../../../models";

type Props = {
  appId: string;
  sourceControlService: EnumSourceControlService;
};

export default function useGetReposOfUser({
  appId,
  sourceControlService,
}: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    getReposOfUser: GitRepo[];
  }>(FIND_GIT_REPOS, {
    variables: {
      id: appId,
      sourceControlService,
    },
    notifyOnNetworkStatusChange: true,
  });
  return {
    refetch,
    error,
    loading,
    networkStatus,
    repos: data?.getReposOfUser,
  };
}

const FIND_GIT_REPOS = gql`
  query getReposOfUser(
    $id: String!
    $sourceControlService: EnumSourceControlService!
  ) {
    getReposOfUser(appId: $id, sourceControlService: $sourceControlService) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
