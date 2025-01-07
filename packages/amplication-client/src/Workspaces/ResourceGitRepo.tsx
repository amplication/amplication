import * as models from "../models";

import {
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

type Props = {
  resource: models.Resource;
};

function ResourceGitRepo({ resource }: Props) {
  const { gitRepository } = resource;

  const gitRepo = gitRepository?.name;

  return (
    <FlexItem
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Small}
      margin={EnumFlexItemMargin.None}
    >
      {gitRepo ? (
        <>
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
