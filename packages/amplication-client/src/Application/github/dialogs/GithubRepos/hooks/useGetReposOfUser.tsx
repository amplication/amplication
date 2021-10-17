import { gql, useQuery } from "@apollo/client";
import { GitRepo } from "../../../../../models";

type Props = {
  appId: string;
};

export default function useGetReposOfUser({ appId }: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    getReposOfUser: GitRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: appId,
    },
    notifyOnNetworkStatusChange: true,
  });
  return { refetch, error, loading, networkStatus, data };
}

const FIND_GITHUB_REPOS = gql`
  query getReposOfUser($id: String!) {
    getReposOfUser(appId: $id, sourceControlService: Github) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
