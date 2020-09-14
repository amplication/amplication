import React, { useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { CircularProgress } from "@rmwc/circular-progress";

import { formatError } from "../util/error";
import * as models from "../models";
import { Dialog } from "../Components/Dialog";
import BuildNewVersion from "./BuildNewVersion";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import { Button, EnumButtonStyle } from "../Components/Button";
import UserAndTime from "../Components/UserAndTime";
import "./NextBuild.scss";

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
      <PanelCollapsible
        className={CLASS_NAME}
        headerContent={
          <>
            <h3>Next Build</h3>
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handleToggleDialog}
            >
              New Build
            </Button>
          </>
        }
      >
        {Boolean(nextBuildError || lastBuildError) && errorMessage}
        {nextBuildLoading && <CircularProgress />}
        <ul className="panel-list">
          {nextBuildData?.commits.map((commit) => (
            <li>
              <div className={`${CLASS_NAME}__details`}>
                <span>{commit.message}</span>
                <UserAndTime
                  firstName={commit.user?.account?.firstName}
                  lastName={commit.user?.account?.lastName}
                  time={commit.createdAt}
                />
              </div>
              <div className={`${CLASS_NAME}__changes`}>12 Changes</div>
            </li>
          ))}
        </ul>
      </PanelCollapsible>
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
