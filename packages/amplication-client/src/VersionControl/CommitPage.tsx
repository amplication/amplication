import { CircularProgress } from "@amplication/ui/design-system";
import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import CommitResourceList from "./CommitResourceList";
import useCommitChanges from "./hooks/useCommitChanges";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const CommitPage: React.FC<Props> = ({ match, moduleClass }) => {
  const commitId = match.params.commit;
  const { commitUtils } = useContext(AppContext);

  const { commitChangesByResource } = useCommitChanges(commitId);

  const currentCommit = useMemo(() => {
    return commitUtils.commits?.find((commit) => commit.id === commitId);
  }, [commitId, commitUtils.commits]);

  return (
    <>
      <div>
        {currentCommit ? (
          <CommitResourceList
            commit={currentCommit}
            commitChangesByResource={commitChangesByResource}
          />
        ) : commitUtils.commitsLoading ? (
          <CircularProgress centerToParent />
        ) : (
          <EmptyState
            message="There are no commits to show"
            image={EnumImages.CommitEmptyState}
          />
        )}
      </div>
    </>
  );
};

export default CommitPage;
