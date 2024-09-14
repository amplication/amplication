import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import * as models from "../models";

type Props = {
  resource: models.Resource;
};

function ResourceLastBuildVersion({ resource }: Props) {
  const lastBuild = resource.builds[0];

  return (
    <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Secondary}>
      {lastBuild?.codeGeneratorVersion}
    </Text>
  );
}

export default ResourceLastBuildVersion;
