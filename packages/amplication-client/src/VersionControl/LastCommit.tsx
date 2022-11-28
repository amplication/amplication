import { useMemo, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { isEmpty } from "lodash";
import * as models from "../models";
import { Tooltip, Button, EnumButtonStyle } from "@amplication/design-system";
import { ClickableId } from "../Components/ClickableId";
import "./LastCommit.scss";
import { AppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { GET_LAST_COMMIT_BUILDS } from "./hooks/commitQueries";
import { useCommitStatus } from "./hooks/useCommitStatus";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type TData = {
  commits: models.Commit[];
};

type Props = {
  projectId: string;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ projectId }: Props) => {
  const {
    currentWorkspace,
    currentProject,
    commitRunning,
    pendingChangesIsError,
  } = useContext(AppContext);

  const { data, loading, refetch } = useQuery<TData>(GET_LAST_COMMIT_BUILDS, {
    variables: {
      projectId,
    },
    skip: !projectId,
  });

  useEffect(() => {
    refetch();
    return () => {
      refetch();
    };
  }, [pendingChangesIsError, refetch, data]);

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits || [];
    return last;
  }, [loading, data]);

  const { commitStatus } = useCommitStatus(lastCommit);
  if (!lastCommit) return null;

  const ClickableCommitId = (
    <ClickableId
      to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Commit"
      eventData={{
        eventName: AnalyticsEventNames.LastCommitIdClick,
      }}
    />
  );

  const generating = commitRunning;

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: generating,
      })}
    >
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__content`}>
        <p className={`${CLASS_NAME}__title`}>
          Last Commit
          <CommitBuildsStatusIcon commitBuildStatus={commitStatus} />
        </p>

        <div className={`${CLASS_NAME}__status`}>
          <div>
            {isEmpty(lastCommit?.message) ? (
              ClickableCommitId
            ) : (
              <Tooltip aria-label={lastCommit?.message} direction="ne">
                {ClickableCommitId}
              </Tooltip>
            )}
          </div>
          <span className={classNames("clickable-id")}>
            {formatTimeToNow(lastCommit?.createdAt)}
          </span>
        </div>
        {lastCommit && (
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/code-view`}
            className={`${CLASS_NAME}__view-code`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              disabled={generating}
            >
              Go to view code
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}

export default LastCommit;
