import { gql, useQuery } from "@apollo/client";
import { EnumSourceControlService } from "../../../models";

type Props = {
  gitOrganizationId: string;
  sourceControlService: EnumSourceControlService;
};

export default function useGitUserName({ gitOrganizationId, sourceControlService }: Props) {
  const { data, loading } = useQuery(GET_GIT_ORGANIZATION_NAME, {
    variables: { gitOrganizationId, sourceControlService },
  });
  return { username: data?.getGitOrganizationName, loadingUsername: loading };
}

const GET_GIT_ORGANIZATION_NAME = gql`
  query getGitOrganizationName(
    $gitOrganizationId: String!
    $sourceControlService: EnumSourceControlService!
  ) {
    getGitOrganizationName(gitOrganizationId: $gitOrganizationId, sourceControlService: $sourceControlService)
  }
`;
