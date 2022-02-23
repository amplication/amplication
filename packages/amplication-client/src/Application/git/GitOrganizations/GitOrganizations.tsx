import { NetworkStatus } from "@apollo/client";
import {
    Button,
  CircularProgress,
  EnumButtonStyle,
  Tooltip,
} from "@amplication/design-system";
import React, { useCallback } from "react";
import useGetGitOrganizations from "../hooks/useGetGitOrganizations";

const CLASS_NAME = "git-repos";

type Props = {
  workspaceId: string;
  setSelectedGitOrganization:(gitOrganizationId:string)=>void
};

function GitOrganizations({ workspaceId ,setSelectedGitOrganization}: Props) {
     const {
    refetch,
    gitOrganizations,
    loading: loadingRepos,
    networkStatus,
  } = useGetGitOrganizations({
    workspaceId: workspaceId,
  });

//   const { handleRepoSelected, error: errorUpdate } = useGitSelected({
//     appId: gitOrganizationId,
//     onCompleted,
//   });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

//   const errorMessage = formatError(error || errorUpdate);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        {loadingRepos || networkStatus === NetworkStatus.refetch ? (
          <CircularProgress />
        ) : (
          <Tooltip aria-label="Refresh repositories" direction="w" noDelay wrap>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              onClick={(e) => {
                handleRefresh();
              }}
              type="button"
              icon="refresh_cw"
            />
          </Tooltip>
        )}
      </div>
      {networkStatus !== NetworkStatus.refetch && // hide data if refetch
        gitOrganizations?.map((gitOrganization) => (
          <li key={gitOrganization.id}  value={gitOrganization.name}/>
        ))}
      <h1/>
    </div>
  );
}

export default GitOrganizations;
