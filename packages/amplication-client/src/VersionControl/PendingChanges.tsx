import React, { useMemo, useState, useCallback, useEffect } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { groupBy, sortBy } from "lodash";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

import imageDone from "../assets/images/done.svg";
import imageNoChanges from "../assets/images/no-changes.svg";
import { formatError } from "../util/error";
import { isEmpty } from "lodash";
import * as models from "../models";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import PendingChange from "./PendingChange";
import "./PendingChanges.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Dialog } from "../Components/Dialog";
import Commit from "./Commit";
import DiscardChanges from "./DiscardChanges";
import useBreadcrumbs from "../Layout/use-breadcrumbs";

const CLASS_NAME = "pending-changes";
const POLL_INTERVAL = 2000;
const STATE_COMMIT_DONE = "done";

type TData = {
  pendingChanges: models.PendingChange[];
};

type Props = {
  match: match<{ application: string }>;
};

const PendingChanges = ({ match }: Props) => {
  const { application } = match.params;
  useBreadcrumbs(match.url, "Pending Changes");
  const history = useHistory();

  const stateMatch = useRouteMatch<{ state: string }>(
    "/:application/pending-changes/:state"
  );

  let state: string | null = null;
  if (stateMatch) {
    state = stateMatch.params.state;
  }

  const { data, loading, error, stopPolling, startPolling, refetch } = useQuery<
    TData
  >(GET_PENDING_CHANGES, {
    variables: {
      applicationId: application,
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

  const [commitDialogOpen, setCommitDialogOpen] = useState<boolean>(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);

  const handleToggleCommitDialog = useCallback(() => {
    setCommitDialogOpen(!commitDialogOpen);
  }, [commitDialogOpen, setCommitDialogOpen]);

  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleCommitDialogCompleted = useCallback(() => {
    setCommitDialogOpen(false);
    history.push(`/${application}/pending-changes/${STATE_COMMIT_DONE}`);
  }, [history, application]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
    if (state === STATE_COMMIT_DONE) {
      history.push(`/${application}/pending-changes`);
    }
  }, [history, application, state]);

  const changesByDate = useMemo(() => {
    const groups = groupBy(data?.pendingChanges, (change) =>
      format(new Date(change.resource.updatedAt), "P")
    );
    return sortBy(Object.entries(groups), ([group, value]) => group);
  }, [data]);

  const message = !data?.pendingChanges
    ? "Loading..."
    : data?.pendingChanges.length > 1
    ? `You have ${data?.pendingChanges.length} Pending Changes`
    : "You have 1 Pending Change";

  const errorMessage = formatError(error);

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />

        {isEmpty(data?.pendingChanges) && !loading ? (
          <div className={`${CLASS_NAME}__empty-state`}>
            {state === STATE_COMMIT_DONE ? (
              <img src={imageDone} alt="done" />
            ) : (
              <img src={imageNoChanges} alt="no changes" />
            )}

            <div className={`${CLASS_NAME}__empty-state__title`}>
              {state === STATE_COMMIT_DONE
                ? "You rock! keep working and come back later"
                : "No pending changes! keep working and come back later"}
            </div>
            <div className={`${CLASS_NAME}__empty-state__sub-title`}>
              When ready, publish your app
            </div>
            <div className={`${CLASS_NAME}__empty-state__actions`}>
              <NavLink to={`/${application}`}>
                <Button buttonStyle={EnumButtonStyle.Secondary}>
                  Keep Working
                </Button>
              </NavLink>
              <NavLink to={`/${application}/builds`}>
                <Button buttonStyle={EnumButtonStyle.Primary}>Publish</Button>
              </NavLink>
            </div>
          </div>
        ) : (
          <>
            <Dialog
              className="commit-dialog"
              isOpen={commitDialogOpen}
              onDismiss={handleToggleCommitDialog}
              title="Commit Pending Changes"
            >
              <Commit
                applicationId={application}
                onComplete={handleCommitDialogCompleted}
              />
            </Dialog>
            <Dialog
              className="discard-dialog"
              isOpen={discardDialogOpen}
              onDismiss={handleToggleDiscardDialog}
              title="Discard Changes"
            >
              <DiscardChanges
                applicationId={application}
                onComplete={handleDiscardDialogCompleted}
                onCancel={handleToggleDiscardDialog}
              />
            </Dialog>
            <div className={`${CLASS_NAME}__header`}>
              <h1>Pending Changes</h1>

              <div className="spacer" />
              {!loading && (
                <>
                  <Button
                    buttonStyle={EnumButtonStyle.Primary}
                    onClick={handleToggleCommitDialog}
                  >
                    Commit Changes
                  </Button>
                  <Button
                    buttonStyle={EnumButtonStyle.Clear}
                    onClick={handleToggleDiscardDialog}
                  >
                    Discard
                  </Button>
                </>
              )}
            </div>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <h3>{message}</h3>

                <div className={`${CLASS_NAME}__timeline`}>
                  {changesByDate.map(([date, changes]) => (
                    <>
                      <div className={`${CLASS_NAME}__timeline__date`}>
                        {date}
                      </div>

                      {changes.map((change) => (
                        <PendingChange
                          key={change.resourceId}
                          change={change}
                        />
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
};

export default PendingChanges;

export const GET_PENDING_CHANGES = gql`
  query pendingChanges($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      action
      resourceType
      versionNumber
      resource {
        __typename
        ... on Entity {
          id
          displayName
          updatedAt
          lockedByUser {
            account {
              firstName
              lastName
            }
          }
        }
        ... on Block {
          id
          displayName
          updatedAt
        }
      }
    }
  }
`;
