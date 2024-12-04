import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { format } from "date-fns";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import GitRepoDetails from "./GitRepoDetails";
import { GIT_PROVIDER_ICON_MAP } from "./constants";
import { useResourceBaseUrl } from "../../util/useResourceBaseUrl";

type Props = {
  resource: models.Resource | null;
};

const DATE_FORMAT = "PP p";

const ResourceGitStatusPanel = ({ resource }: Props) => {
  const {
    gitRepositoryUrl,
    gitRepositoryFullName,
    gitRepositoryOrganizationProvider,
  } = useContext(AppContext);

  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resource?.id });

  const lastSync = resource?.githubLastSync
    ? new Date(resource.githubLastSync)
    : null;

  const lastSyncDate = lastSync ? format(lastSync, DATE_FORMAT) : "Never";

  return isEmpty(resource?.gitRepository) ? (
    <Link title={"Connect to a git provider"} to={`${baseUrl}/git-sync`}>
      <FlexItem>
        <Text
          textStyle={EnumTextStyle.Subtle}
          textColor={EnumTextColor.ThemeTurquoise}
        >
          Click here to connect to a git provider to get a Pull Request with the
          generated code
        </Text>
      </FlexItem>
    </Link>
  ) : (
    <FlexItem
      gap={EnumGapSize.Small}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
    >
      <FlexItem
        gap={EnumGapSize.Small}
        direction={EnumFlexDirection.Row}
        itemsAlign={EnumItemsAlign.Center}
      >
        <Icon
          icon={GIT_PROVIDER_ICON_MAP[gitRepositoryOrganizationProvider]}
          size="small"
          color={EnumTextColor.Black20}
        />
        <Text textStyle={EnumTextStyle.Subtle}>Connected to:</Text>
        <a
          href={gitRepositoryUrl}
          target={
            gitRepositoryOrganizationProvider?.toLocaleLowerCase() || "_blank"
          }
          rel="noreferrer"
        >
          <Text
            textStyle={EnumTextStyle.Subtle}
            textColor={EnumTextColor.White}
          >
            <GitRepoDetails gitRepositoryFullName={gitRepositoryFullName} />
          </Text>
        </a>
        <span />
        <span />
        <Text textStyle={EnumTextStyle.Subtle}>Last sync:</Text>
        <Text textStyle={EnumTextStyle.Subtle} textColor={EnumTextColor.White}>
          {lastSyncDate}
        </Text>
      </FlexItem>
    </FlexItem>
  );
};

export default ResourceGitStatusPanel;
