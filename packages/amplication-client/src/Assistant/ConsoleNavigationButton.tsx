import { EnumButtonStyle } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { Button } from "../Components/Button";
import { useAppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CLASS_NAME = "console-navigation-button";

const ConsoleNavigationButton = () => {
  const { currentProject } = useAppContext();

  const { isPlatformConsole } = useProjectBaseUrl();

  const { baseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: !isPlatformConsole,
  });

  if (!currentProject) {
    return null;
  }

  const label = !isPlatformConsole ? "Platform Console" : "Service Catalog";

  return (
    <Link to={baseUrl} className={CLASS_NAME}>
      <Button
        buttonStyle={EnumButtonStyle.Text}
        eventData={{
          eventName: AnalyticsEventNames.AskJovuClick,
        }}
      >
        {label}
      </Button>
    </Link>
  );
};

export default ConsoleNavigationButton;
