import React, { useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";

import { formatError } from "../util/error";
import * as models from "../models";
import { Dialog } from "../Components/Dialog";
import BuildNewVersion from "./BuildNewVersion";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import { Button, EnumButtonStyle } from "../Components/Button";
import UserAndTime from "../Components/UserAndTime";
import { GET_LAST_BUILD } from "./LastBuild";

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
  });
  const errorMessage = formatError(lastBuildError || nextBuildError);

  const loading = nextBuildLoading || lastBuildLoading;

  return (
    <>
      <PanelCollapsible
        initiallyOpen
        className={CLASS_NAME}
        headerContent={
          <>
            {loading ? (
              <>
                <h3>Loading Pending Commits</h3>
                <CircularProgress />
              </>
            ) : (
              <>
                <h3>{`${nextBuildData?.commits.length} ${
                  nextBuildData?.commits.length === 1
                    ? "Pending Commit"
                    : "Pending Commits"
                }`}</h3>
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={handleToggleDialog}
                >
                  Create New Build
                </Button>
              </>
            )}
          </>
        }
      >
        {Boolean(nextBuildError || lastBuildError) && errorMessage}

        {!nextBuildLoading && !lastBuildLoading && (
          <ul className="panel-list">
            {isEmpty(nextBuildData?.commits) && (
              <li>There is nothing new since last build</li>
            )}
            {nextBuildData?.commits.map((commit) => (
              <li>
                <div className={`${CLASS_NAME}__details`}>
                  <span>{commit.message}</span>
                  <UserAndTime
                    firstName={commit.user?.account?.firstName || ""}
                    lastName={commit.user?.account?.lastName || ""}
                    time={commit.createdAt}
                  />
                </div>
                <div className={`${CLASS_NAME}__changes`}>12 Changes</div>
              </li>
            ))}
          </ul>
        )}
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
