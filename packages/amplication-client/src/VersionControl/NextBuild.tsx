import React, { useEffect, useCallback, useState } from "react";
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
const POLL_INTERVAL = 2000;

type TData = {
  commits: models.Commit[];
};

type Props = {
  applicationId: string;
};

const NextBuild = ({ applicationId }: Props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleToggleDialog = useCallback(() => {
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  const { data, loading, error, stopPolling, startPolling, refetch } = useQuery<
    TData
  >(GET_NEXT_BUILD_COMMITS, {
    variables: {
      applicationId: applicationId,
      lastBuildCreatedAt: "2020-09-01 10:10:10",
    },
  });

  //start polling with cleanup
  useEffect(() => {
    refetch();
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  const errorMessage = formatError(error);

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
          {Boolean(error) && errorMessage}
          {loading && <CircularProgress />}
          <ul>
            {data?.commits.map((commit) => (
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
        title="New Version"
      >
        <BuildNewVersion
          applicationId={applicationId}
          onComplete={handleToggleDialog}
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
