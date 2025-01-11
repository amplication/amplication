import {
  Button,
  EnumButtonState,
  EnumButtonStyle,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { PrivatePlugin } from "../models";
import { getGitRepositoryDetails } from "../util/git-repository-details";

type Props = {
  privatePlugin: PrivatePlugin;
};

const PrivatePluginEditCodeButton = ({ privatePlugin }: Props) => {
  const { pluginRepositoryResource } = useContext(AppContext);

  const gitRepositoryDetails = getGitRepositoryDetails({
    organization: pluginRepositoryResource?.gitRepository?.gitOrganization,
    repositoryName: pluginRepositoryResource?.gitRepository?.name,
    groupName: pluginRepositoryResource?.gitRepository?.groupName,
  });

  if (!gitRepositoryDetails) {
    return null;
  }

  const url =
    gitRepositoryDetails.webIdeUrl ?? `${gitRepositoryDetails.repositoryUrl}`;

  return (
    <a href={url} target="webIde" rel="noreferrer">
      <Button
        buttonStyle={EnumButtonStyle.Outline}
        buttonState={EnumButtonState.Success}
      >
        {gitRepositoryDetails.webIdeUrl
          ? `Edit with ${gitRepositoryDetails.webIdeName}`
          : "Open Repository"}
      </Button>
    </a>
  );
};

export default PrivatePluginEditCodeButton;
