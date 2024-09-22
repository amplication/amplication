import {
  Button,
  EnumButtonState,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { formatDistanceToNow } from "date-fns";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import { AppContext } from "../context/appContext";
import { Commit, EnumBuildStatus } from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import "./LastCommit.scss";
import { useCommitStatus } from "./hooks/useCommitStatus";
import BuildGitLink from "./BuildGitLink";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  lastCommit: Commit;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ lastCommit }: Props) => {
  const { commitRunning } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const { commitStatus, commitLastError } = useCommitStatus(lastCommit);
  if (!lastCommit) return null;

  const singleBuild = lastCommit.builds && lastCommit.builds.length === 1;

  const ClickableCommitId = (
    <ClickableId
      to={`${baseUrl}/commits/${lastCommit.id}`}
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
        {commitLastError && (
          <FlexItem
            direction={EnumFlexDirection.Column}
            margin={EnumFlexItemMargin.Top}
          >
            <Link to={`${baseUrl}/commits/${lastCommit.id}`}>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.ThemeRed}
              >
                {commitLastError}
              </Text>{" "}
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
                underline
              >
                View details
              </Text>
            </Link>
          </FlexItem>
        )}
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

        {singleBuild ? (
          <BuildGitLink build={lastCommit.builds[0]} />
        ) : (
          <Link
            to={`${baseUrl}/commits/${lastCommit.id}`}
            className={`${CLASS_NAME}__view-code`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              disabled={
                commitRunning || commitStatus === EnumBuildStatus.Running
              }
              buttonState={EnumButtonState.Success}
            >
              View code (multiple builds)
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
