import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  Icon,
  Tooltip,
  VersionTag,
} from "@amplication/ui/design-system";
import * as models from "../models";
import { valid } from "semver";
import { Link } from "react-router-dom";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import { CodeGeneratorVersionStrategy } from "../models";

type Props = {
  resource: models.Resource;
};

const STRATEGY_TO_ICON: {
  [key in CodeGeneratorVersionStrategy]: {
    icon: string;
    color: EnumTextColor;
    title: string;
  };
} = {
  [models.CodeGeneratorVersionStrategy.LatestMajor]: {
    icon: "activity",
    color: EnumTextColor.White,
    title: "This service automatically updates to the latest version",
  },
  [models.CodeGeneratorVersionStrategy.LatestMinor]: {
    icon: "activity",
    color: EnumTextColor.Black20,
    title:
      "This service only updates to the latest minor version within the current major version",
  },
  [models.CodeGeneratorVersionStrategy.Specific]: {
    icon: "lock",
    color: EnumTextColor.Black20,
    title: "This service is locked to a specific version",
  },
};

function ResourceLastBuildVersion({ resource }: Props) {
  const lastBuild = resource.builds[0];
  const validVersion = valid(lastBuild?.codeGeneratorVersion);
  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: resource.id,
  });

  if (!validVersion) {
    return null;
  }
  const url = `${baseUrl}/settings/code-generator-version`;

  const { title, ...props } = STRATEGY_TO_ICON[resource.codeGeneratorStrategy];

  return (
    <Link to={url}>
      <FlexItem
        direction={EnumFlexDirection.Row}
        gap={EnumGapSize.Small}
        itemsAlign={EnumItemsAlign.Center}
      >
        <VersionTag version={validVersion} />
        <Tooltip title={title}>
          <Icon {...props} />
        </Tooltip>
      </FlexItem>
    </Link>
  );
}

export default ResourceLastBuildVersion;
