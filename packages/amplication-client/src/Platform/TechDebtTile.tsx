import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";

import OverviewSecondaryTile from "../Resource/OverviewSecondaryTile";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const LINK =
  "https://docs.amplication.com/day-two/resolve-debt-across-multiple-resources";

function TechDebtTile() {
  const { baseUrl } = useProjectBaseUrl();

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <OverviewSecondaryTile
      to={`${baseUrl}/tech-debt`}
      icon="tag"
      title="Tech Debt"
      message="Reduce and prevent technical debt by enforcing standardized architectures, best practices, and automated updates. With Live Templates and Private Plugins, teams can ensure consistency, streamline maintenance, and keep services aligned with evolving organizational standards. The Platform Console notifies teams when updates are available, ensuring services stay up to date with the latest improvements."
      themeColor={EnumTextColor.ThemeGreen}
    >
      <a href={LINK} target="blank" onClick={handleLearnMoreClick}>
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.ThemeTurquoise}
        >
          {"Read more about Tech Debt"}
        </Text>
      </a>
    </OverviewSecondaryTile>
  );
}

export default TechDebtTile;
