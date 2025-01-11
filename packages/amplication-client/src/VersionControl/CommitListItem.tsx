import React, { useContext } from "react";
import * as models from "../models";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import CommitData from "./CommitData";
import { useCommitStatus } from "./hooks/useCommitStatus";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import { FlexItem } from "@amplication/ui/design-system";

type Props = {
  projectId: string;
  commit: models.Commit;
};

export const CommitListItem = ({ commit, projectId }: Props) => {
  const { currentWorkspace } = useContext(AppContext);
  const { commitStatus } = useCommitStatus(commit);
  return (
    <InnerTabLink
      icon=""
      to={`/${currentWorkspace?.id}/${projectId}/commits/${commit.id}`}
    >
      <FlexItem>
        <CommitData commit={commit} />
        <FlexItem.FlexEnd minWidthAuto={true}>
          <CommitBuildsStatusIcon commitBuildStatus={commitStatus} />
        </FlexItem.FlexEnd>
      </FlexItem>
    </InnerTabLink>
  );
};
