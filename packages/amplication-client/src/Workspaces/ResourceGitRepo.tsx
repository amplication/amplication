import * as models from "../models";

import {
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";

type Props = {
  resource: models.Resource;
};

function ResourceGitRepo({ resource }: Props) {
  const { gitRepository } = resource;

  const provider = gitRepository?.gitOrganization?.provider;

  const gitRepo =
    gitRepository && provider === models.EnumGitProvider.Github
      ? `${gitRepository.gitOrganization.name}/${gitRepository.name}`
      : provider === models.EnumGitProvider.Bitbucket
      ? `${gitRepository.groupName}/${gitRepository.name}`
      : undefined;

  return (
    <FlexItem
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Small}
      margin={EnumFlexItemMargin.None}
    >
      {gitRepo ? (
        <>
          <Icon
            icon={gitProviderIconMap[provider || models.EnumGitProvider.Github]}
            size="xsmall"
          />
          <Text
            textStyle={EnumTextStyle.Subtle}
            textColor={EnumTextColor.White}
          >
            {gitRepo}
          </Text>
        </>
      ) : (
        <Text
          textStyle={EnumTextStyle.Subtle}
          textColor={EnumTextColor.ThemeRed}
        >
          Not connected
        </Text>
      )}
    </FlexItem>
  );
}

export default ResourceGitRepo;
