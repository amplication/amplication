import { useContext } from "react";
import classNames from "classnames";
import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { ClickableId } from "../Components/ClickableId";
import "./LastCommit.scss";
import { AppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useCommitStatus } from "./hooks/useCommitStatus";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { Commit } from "../models";

type Props = {
  lastCommit: Commit;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ lastCommit }: Props) => {
  const { currentWorkspace, currentProject, commitRunning } =
    useContext(AppContext);

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

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: commitRunning,
      })}
    >
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__content`}>
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          end={<CommitBuildsStatusIcon commitBuildStatus={commitStatus} />}
        >
          <Text textStyle={EnumTextStyle.H4}>Last Commit</Text>
        </FlexItem>

        <FlexItem
          direction={EnumFlexDirection.Column}
          margin={EnumFlexItemMargin.Both}
          gap={EnumGapSize.Small}
        >
          {ClickableCommitId}
          <Text textStyle={EnumTextStyle.Tag}>
            {formatTimeToNow(lastCommit?.createdAt)}
          </Text>
        </FlexItem>

        {lastCommit && (
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/code-view`}
            className={`${CLASS_NAME}__view-code`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              disabled={commitRunning}
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
