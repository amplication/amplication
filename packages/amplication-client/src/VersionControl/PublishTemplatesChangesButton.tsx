import {
  Button,
  EnumButtonStyle,
  Snackbar,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import {
  CommitResourceVersionCreateInput,
  EnumCommitStrategy,
  EnumResourceTypeGroup,
} from "../models";
import useCommits from "./hooks/useCommits";
import "./PublishChangesPage.scss";
import { formatError } from "../util/error";

type Props = {
  buttonText: string;
  commitMessage: string;
  projectId: string;
  strategy: EnumCommitStrategy;
  resourceId?: string;
  resourceVersions: CommitResourceVersionCreateInput[];
};

const PublishTemplatesChangesButton: React.FC<Props> = ({
  buttonText,
  projectId,
  commitMessage,
  strategy,
  resourceId,
  resourceVersions,
}: Props) => {
  const { commitChanges, commitChangesError, commitChangesLoading } =
    useCommits(projectId);

  const errorMessage = formatError(commitChangesError);

  const handleClick = useCallback(() => {
    commitChanges({
      message: commitMessage,
      project: { connect: { id: projectId } },
      bypassLimitations: true,
      commitStrategy: strategy,
      resourceTypeGroup: EnumResourceTypeGroup.Platform,
      resourceIds: resourceId ? [resourceId] : undefined,
      resourceVersions: resourceVersions,
    });
  }, [
    commitChanges,
    commitMessage,
    projectId,
    resourceId,
    resourceVersions,
    strategy,
  ]);

  return (
    <>
      <Button
        buttonStyle={EnumButtonStyle.Primary}
        onClick={() => handleClick()}
        disabled={commitChangesLoading}
      >
        {buttonText}
      </Button>
      <Snackbar open={Boolean(commitChangesError)} message={errorMessage} />
    </>
  );
};

export default PublishTemplatesChangesButton;
