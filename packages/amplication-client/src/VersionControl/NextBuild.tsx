import React, { useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { CircularProgress } from "@rmwc/circular-progress";

import { formatError } from "../util/error";
import * as models from "../models";
import { EnumButtonStyle } from "../Components/Button";
import { Dialog } from "../Components/Dialog";
import BuildNewVersion from "./BuildNewVersion";
import {
  Panel,
  PanelHeader,
  EnumPanelStyle,
  PanelBody,
} from "../Components/Panel";

const CLASS_NAME = "next-build";

type TData = {
  commits: models.Commit[];
};

type Props = {
  applicationId: string;
};

const NextBuild = ({ applicationId }: Props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const {
    data: lastBuildData,
    loading: lastBuildLoading,
    error: lastBuildError,
    refetch: lastBuildRefetch,
  } = useQuery<{
    builds: models.Build[];
  }>(GET_LAST_BUILD, {
    onCompleted: () => {
      nextBuildRefetch();
    },
    variables: {
      appId: applicationId,
    },
  });

  const handleToggleDialog = useCallback(() => {
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  const handleNewVersionComplete = useCallback(() => {
    lastBuildRefetch();
    setDialogOpen(false);
  }, [lastBuildRefetch, setDialogOpen]);

  const lastBuild = useMemo(() => {
    if (lastBuildLoading) return null;
    const [last] = lastBuildData?.builds;
    return last;
  }, [lastBuildLoading, lastBuildData]);

  const {
    data: nextBuildData,
    loading: nextBuildLoading,
    error: nextBuildError,
    refetch: nextBuildRefetch,
  } = useQuery<TData>(GET_NEXT_BUILD_COMMITS, {
    variables: {
      applicationId: applicationId,
      lastBuildCreatedAt: lastBuild?.createdAt,
    },
    skip: !lastBuild,
  });
  const errorMessage = formatError(lastBuildError || nextBuildError);

  return (
    <>
      <Panel panelStyle={EnumPanelStyle.Collapsible} className={CLASS_NAME}>
        <PanelHeader
          title="Next Build"
          action={{
            label: "Build",
            buttonStyle: EnumButtonStyle.Primary,
            onClick: handleToggleDialog,
          }}
        />
        <PanelBody>
          {Boolean(nextBuildError || lastBuildError) && errorMessage}
          {nextBuildLoading && <CircularProgress />}
          <ul>
            {nextBuildData?.commits.map((commit) => (
              <li>
                {commit.message}
                {commit.createdAt}
                {commit.user?.account?.firstName}{" "}
              </li>
            ))}
          </ul>
        </PanelBody>
      </Panel>
      <Dialog
        className="commit-dialog"
        isOpen={dialogOpen}
        onDismiss={handleToggleDialog}
        title="New Build"
      >
        <BuildNewVersion
          applicationId={applicationId}
          onComplete={handleNewVersionComplete}
          lastBuildVersion={lastBuild?.version}
        />
      </Dialog>
    </>
  );
};

export default NextBuild;

export const GET_NEXT_BUILD_COMMITS = gql`
  query nextBuildCommits(
    $applicationId: String!
    $lastBuildCreatedAt: DateTime
  ) {
    commits(
      where: {
        app: { id: $applicationId }
        createdAt: { gt: $lastBuildCreatedAt }
      }
    ) {
      id
      createdAt
      userId
      user {
        account {
          firstName
          lastName
        }
      }
      message
    }
  }
`;

const GET_LAST_BUILD = gql`
  query lastBuild($appId: String!) {
    builds(
      where: { app: { id: $appId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      version
      createdAt
    }
  }
`;
