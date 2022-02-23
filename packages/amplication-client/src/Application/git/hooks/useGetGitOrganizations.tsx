import { EnumSourceControlService } from "@amplication/data/dist/models";
import { gql, useQuery } from "@apollo/client";
import { GitOrganization } from "../../../models";

type Props = {
  workspaceId: string;
};

export default function useGetGitOrganizations({
  workspaceId
}: Props) {
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    gitOrganizations: GitOrganization[];
  }>(GET_GIT_ORGANIZATIONS, {
    variables: {
      workspaceId: workspaceId,
      sourceControlService: EnumSourceControlService.Github
        },
    notifyOnNetworkStatusChange: true,
  });
  return {
    refetch,
    error,
    loading,
    networkStatus,
    gitOrganizations: data?.gitOrganizations,
  };
}

 const GET_GIT_ORGANIZATIONS = gql`
  query getGitOrganizations($workspaceId: String!, $sourceControlService: EnumSourceControlService!), {
    gitOrganizations(data: { workspaceId: $workspaceId, sourceControlService:$sourceControlService}) {
      id
      name
    }
  }
`;
