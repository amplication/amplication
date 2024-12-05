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
import { GIT_PROVIDER_ICON_MAP } from "../Resource/git/constants";

type Props = {
  resource: models.Resource;
};

function ResourceGitOrg({ resource }: Props) {
  const { gitRepository } = resource;

  const provider = gitRepository?.gitOrganization?.provider;

  const gitOrg = gitRepository
    ? provider === models.EnumGitProvider.Bitbucket
      ? gitRepository.groupName
      : gitRepository?.gitOrganization.name
    : undefined;

  return (
    <FlexItem
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Small}
      margin={EnumFlexItemMargin.None}
    >
      {gitOrg ? (
        <>
          <Icon
            icon={
              GIT_PROVIDER_ICON_MAP[provider || models.EnumGitProvider.Github]
            }
            size="small"
          />
          <Text
            textStyle={EnumTextStyle.Subtle}
            textColor={EnumTextColor.White}
          >
            {gitOrg}
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

export default ResourceGitOrg;
