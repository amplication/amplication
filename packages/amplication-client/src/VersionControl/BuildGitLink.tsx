import {
  Button,
  EnumButtonState,
  EnumButtonStyle,
  EnumTextColor,
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
  const { gitUrl, gitPrTitle } = useBuildGitUrl(build);

  return (
    gitUrl && (
      <a href={gitUrl} target={"git"}>
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          buttonState={EnumButtonState.Success}
        >
          {gitPrTitle}
        </Button>
      </a>
    )
  );
};

export default BuildGitLink;
