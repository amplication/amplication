import {
  EnumButtonStyle,
  EnumIconPosition,
  OptionItem,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

export const CATALOG_COLOR = "#A787FF";
export const PLATFORM_COLOR = "#f6aa50";

const OPTIONS: OptionItem[] = [
  {
    value: "catalog",
    label: "Project Catalog",
    icon: "code",
    description: "View and manage resources in the project",
    color: CATALOG_COLOR,
  },
  {
    value: "platform",
    label: "Project Platform",
    icon: "grid",
    description: "Manage platform settings like templates and plugins",
    color: PLATFORM_COLOR,
  },
];

const ConsoleNavigationButton = () => {
  const history = useHistory();

  const { baseUrl: platformBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const { baseUrl: catalogBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  const { isPlatformConsole } = useProjectBaseUrl();

  const handleValueSelected = useCallback(
    (value: string) => {
      const url = value === "catalog" ? catalogBaseUrl : platformBaseUrl;

      history.push(url);
    },
    [catalogBaseUrl, history, platformBaseUrl]
  );

  return (
    <SelectPanel
      selectedValue={isPlatformConsole ? "platform" : "catalog"}
      isMulti={false}
      onChange={handleValueSelected}
      options={OPTIONS}
      label={"Role"}
      selectedItemInTextMode
      showLabelWhenSelected={false}
      openButtonProps={{
        icon: "chevron_up",
      }}
      buttonProps={{
        buttonStyle: EnumButtonStyle.Text,
        icon: "chevron_down",
        iconPosition: EnumIconPosition.Right,
      }}
    />
  );
};

export default ConsoleNavigationButton;
