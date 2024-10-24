import { EnumTabsStyle, Icon, Tabs } from "@amplication/ui/design-system";
import { useAppContext } from "../context/appContext";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CLASS_NAME = "console-navigation-button";

const ConsoleNavigationButton = () => {
  const { currentProject } = useAppContext();

  const { baseUrl: platformBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const { baseUrl: catalogBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  if (!currentProject) {
    return null;
  }

  return (
    <Tabs tabsStyle={EnumTabsStyle.Header} className={CLASS_NAME}>
      <Tabs.Tab
        name="Service Catalog"
        to={catalogBaseUrl}
        exact={false}
        icon={<Icon icon="code" size="small" />}
      />
      <Tabs.Tab
        name="Platform Console"
        to={platformBaseUrl}
        exact={false}
        icon={<Icon icon="grid" size="small" />}
      />
    </Tabs>
  );
};

export default ConsoleNavigationButton;
