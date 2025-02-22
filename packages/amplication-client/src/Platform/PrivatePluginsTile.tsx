import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";

import OverviewSecondaryTile from "../Resource/OverviewSecondaryTile";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const LINK = "https://docs.amplication.com/day-zero/private-plugins";

function PrivatePluginsTile() {
  const { baseUrl } = useProjectBaseUrl();

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <OverviewSecondaryTile
      to={`${baseUrl}/private-plugins`}
      icon="plugin"
      title="Private Plugins"
      message="Extend and customize your services by integrating Private Plugins, enforcing best practices, and embedding Golden Paths into your development workflow. Private Plugins are managed in your own Git repository."
      themeColor={EnumTextColor.ThemeBlue}
    >
      <a href={LINK} target="blank" onClick={handleLearnMoreClick}>
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.ThemeTurquoise}
        >
          {"Read more about Private Plugins"}
        </Text>
      </a>
    </OverviewSecondaryTile>
  );
}

export default PrivatePluginsTile;
