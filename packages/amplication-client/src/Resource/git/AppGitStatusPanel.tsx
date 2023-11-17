import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { format } from "date-fns";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import GitRepoDetails from "./GitRepoDetails";

type Props = {
  resource: models.Resource | null;
  showDisconnectedMessage: boolean;
};

const DATE_FORMAT = "PP p";

const AppGitStatusPanel = ({ resource, showDisconnectedMessage }: Props) => {
  const {
    currentWorkspace,
    currentProject,
    gitRepositoryUrl,
    gitRepositoryFullName,
    gitRepositoryOrganizationProvider,
  } = useContext(AppContext);

  const lastSync = resource?.githubLastSync
    ? new Date(resource.githubLastSync)
    : null;

  const lastSyncDate = lastSync ? format(lastSync, DATE_FORMAT) : "Never";

  return isEmpty(resource?.gitRepository) ? (
    <>
      {showDisconnectedMessage && (
        <FlexItem margin={EnumFlexItemMargin.Both}>
          <Text
            textStyle={EnumTextStyle.Tag}
            textColor={EnumTextColor.ThemeOrange}
          >
            Connect to a git provider to create a Pull Request with the
            generated code
          </Text>
        </FlexItem>
      )}
      <Link
        title={"Connect to a git provider"}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource?.id}/git-sync`}
      >
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          style={{ minWidth: "140px" }}
        >
          Connect to Git
        </Button>
      </Link>
    </>
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

export default AppGitStatusPanel;
