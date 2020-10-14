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

  const handleToggleDialog = useCallback(
    (event) => {
      event.stopPropagation();
      setDialogOpen(!dialogOpen);
    },
    [dialogOpen, setDialogOpen]
  );

  const handleNewVersionComplete = useCallback(() => {
    lastBuildRefetch();
    setDialogOpen(false);
  }, [lastBuildRefetch, setDialogOpen]);

  const lastBuild = useMemo(() => {
    if (lastBuildLoading) return null;
    if (isEmpty(lastBuildData?.builds)) return null;
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
            <h3>Create new version</h3>
            <span>
              {nextBuildData?.commits.length}{" "}
              {nextBuildData?.commits.length === 1
                ? "Pending Commit"
                : "Pending Commits"}
            </span>
            <span className="spacer" />
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              disabled={loading}
              onClick={handleToggleDialog}
            >
              Build
            </Button>
          </>
        }
      >
        {Boolean(nextBuildError || lastBuildError) && errorMessage}
        {loading ? (
          <CircularProgress />
        ) : (
          <ul className="panel-list">
            {isEmpty(nextBuildData?.commits) && (
              <li>There is nothing new since last build</li>
            )}
            {nextBuildData?.commits.map((commit) => (
              <li key={commit.id}>
                <div className={`${CLASS_NAME}__details`}>
                  <span>{commit.message}</span>
                  <UserAndTime
                    account={commit.user?.account}
                    time={commit.createdAt}
                  />
                </div>
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
