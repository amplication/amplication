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
  const { gitUrl, diffStat } = useBuildGitUrl(build);

  return (
    <>
      {gitUrl && (
        <a href={gitUrl} target={"git"}>
          <Text textStyle={EnumTextStyle.Subtle} textColor={textColor}>
            {gitUrl}
          </Text>
        </a>
      )}
      {diffStat && (
        <Text
          textStyle={EnumTextStyle.Subtle}
          textColor={EnumTextColor.ThemeOrange}
        >
          {diffStat}
        </Text>
      )}
    </>
  );
};

export default BuildGitLink;
