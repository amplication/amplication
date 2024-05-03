import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import * as models from "../models";
import useBuildGitUrl from "./useBuildGitUrl";

type Props = {
  build?: models.Build;
  textColor?: EnumTextColor;
};

const BuildGitLink = ({
  build,
  textColor = EnumTextColor.ThemeTurquoise,
}: Props) => {
  const buildGitUrl = useBuildGitUrl(build);

  return (
    buildGitUrl && (
      <a href={buildGitUrl} target={"git"}>
        <Text textStyle={EnumTextStyle.Subtle} textColor={textColor}>
          {buildGitUrl}
        </Text>
      </a>
    )
  );
};

export default BuildGitLink;
