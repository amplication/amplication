import { Link } from "react-router-dom";
import * as models from "../models";
import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  UserAndTime,
} from "@amplication/ui/design-system";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { CommitBuildsStatusIcon } from "../VersionControl/CommitBuildsStatusIcon";
import { BUILD_STATUS_TO_COLOR } from "../VersionControl/constants";

type Props = {
  resource: models.Resource;
  hideLabel?: boolean;
};

function ResourceLastBuild({ resource, hideLabel }: Props) {
  const lastBuild = resource.builds[0];

  const { baseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
    overrideProjectId: resource.projectId,
  });

  const innerElement = (
    <>
      <UserAndTime
        showUserAvatar={false}
        account={lastBuild?.commit?.user?.account || {}}
        time={lastBuild?.createdAt}
        label={hideLabel ? "" : "Last commit:"}
        valueColor={
          lastBuild
            ? BUILD_STATUS_TO_COLOR[lastBuild.status]
            : EnumTextColor.White
        }
      />
    </>
  );

  if (!lastBuild) {
    return innerElement;
  } else {
    const url = `${baseUrl}/commits/${lastBuild?.commitId}/builds/${lastBuild?.id}`;
    return (
      <Link to={url} className="">
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          direction={EnumFlexDirection.Row}
          gap={EnumGapSize.Small}
          margin={EnumFlexItemMargin.None}
        >
          <CommitBuildsStatusIcon commitBuildStatus={lastBuild?.status} />
          {innerElement}
        </FlexItem>
      </Link>
    );
  }
}

export default ResourceLastBuild;
