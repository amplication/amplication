import {
  EnumTabsStyle,
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Tabs,
  Text,
} from "@amplication/ui/design-system";
import { useAppContext } from "../context/appContext";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { Link } from "react-router-dom";

const CLASS_NAME = "console-navigation-button";

const ConsoleNavigationButton = () => {
  const { currentProject, currentWorkspace } = useAppContext();

  const { baseUrl: platformBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const { baseUrl: catalogBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  if (!currentProject) {
    return (
      <Link to={`/${currentWorkspace?.id}`}>
        <Text textColor={EnumTextColor.White} textStyle={EnumTextStyle.Tag}>
          {" "}
          {currentWorkspace?.name}
        </Text>
      </Link>
    );
  }

  return (
    <Tabs tabsStyle={EnumTabsStyle.Header} className={CLASS_NAME}>
      <Tabs.Tab
        name="Catalog"
        to={catalogBaseUrl}
        exact={false}
        icon={<Icon icon="code" size="small" />}
      />
      <Tabs.Tab
        name="Platform"
        to={platformBaseUrl}
        exact={false}
        icon={<Icon icon="grid" size="small" />}
      />
    </Tabs>
  );
};

export default ConsoleNavigationButton;
