import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";

import OverviewSecondaryTile from "../Resource/OverviewSecondaryTile";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const LINK = "https://docs.amplication.com/day-zero/live-templates";

function TemplatesTile() {
  const { baseUrl } = useProjectBaseUrl();

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <OverviewSecondaryTile
      to={`${baseUrl}/templates`}
      icon="template"
      title="Templates"
      message="Create standardized services by combining specific plugins into a reusable Live Template, ensuring consistency, best practices, and centralized updates across all services. To create a template, go to any resource and click 'Create Template from Resource'"
      themeColor={EnumTextColor.ThemeOrange}
    >
      <a href={LINK} target="blank" onClick={handleLearnMoreClick}>
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.ThemeTurquoise}
        >
          {"Read more about Live Templates"}
        </Text>
      </a>
    </OverviewSecondaryTile>
  );
}

export default TemplatesTile;
