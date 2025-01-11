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
  version: string;
  codeGeneratorStrategy: CodeGeneratorVersionStrategy;
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
    title: "The service automatically updates to the latest version",
  },
  [models.CodeGeneratorVersionStrategy.LatestMinor]: {
    icon: "activity",
    color: EnumTextColor.Black20,
    title:
      "The service only updates to the latest minor version within the current major version",
  },
  [models.CodeGeneratorVersionStrategy.Specific]: {
    icon: "lock",
    color: EnumTextColor.Black20,
    title: "The service is locked to a specific version",
  },
};

function ResourceCodeEngineVersion({
  version,
  codeGeneratorStrategy,
  resource,
}: Props) {
  const validVersion = valid(version);
  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: resource.id,
    overrideProjectId: resource.projectId,
    overrideIsPlatformConsole:
      resource.resourceType === models.EnumResourceType.ServiceTemplate,
  });

  const url = `${baseUrl}/settings/code-generator-version`;

  const { title, ...props } = STRATEGY_TO_ICON[codeGeneratorStrategy];

  const titleWithVersion = version ? `${title} (${version})` : title;

  return (
    <Link to={url}>
      <FlexItem
        direction={EnumFlexDirection.Row}
        gap={EnumGapSize.Small}
        itemsAlign={EnumItemsAlign.Center}
      >
        <VersionTag version={validVersion || "latest"} />
        <Tooltip title={titleWithVersion}>
          <Icon {...props} />
        </Tooltip>
      </FlexItem>
    </Link>
  );
}

export default ResourceCodeEngineVersion;
