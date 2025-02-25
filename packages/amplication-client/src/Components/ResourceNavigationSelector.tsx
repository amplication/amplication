import {
  EnumButtonStyle,
  EnumIconPosition,
  OptionItem,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import { EnumResourceType } from "../models";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CATALOG_VALUE = "catalog";
const PLATFORM_VALUE = "platform";

const CATALOG_ITEM: OptionItem = {
  label: "Catalog",
  value: CATALOG_VALUE,
};

const PLATFORM_ITEM: OptionItem = {
  label: "Platform",
  value: PLATFORM_VALUE,
  separator: true,
};

const ResourceNavigationSelector = () => {
  const { resources, currentWorkspace, currentProject, currentResource } =
    useAppContext();

  const history = useHistory();
  const { isPlatformConsole } = useProjectBaseUrl();

  const selectedValue = useMemo(() => {
    if (currentResource) {
      return currentResource.id;
    }
    return isPlatformConsole ? PLATFORM_VALUE : CATALOG_VALUE;
  }, [currentResource, isPlatformConsole]);

  const handleResourceSelected = useCallback(
    (value: string) => {
      const platformPath = isPlatformConsole ? "/platform" : "";

      const url =
        value === CATALOG_VALUE
          ? `/${currentWorkspace?.id}/${currentProject?.id}`
          : value === PLATFORM_VALUE
          ? `/${currentWorkspace?.id}/platform/${currentProject?.id}`
          : `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}/${value}`;

      history.push(url);
    },
    [currentProject?.id, currentWorkspace?.id, history, isPlatformConsole]
  );

  const options = useMemo(() => {
    const projects = resources
      ?.filter((resource) => {
        if (isPlatformConsole) {
          return resource.resourceType === EnumResourceType.ServiceTemplate;
        } else {
          return resource.resourceType !== EnumResourceType.ServiceTemplate;
        }
      })
      .map((resource) => ({
        value: resource.id,
        label: resource.name,
        color: resource.blueprint.color,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [CATALOG_ITEM, PLATFORM_ITEM, ...projects];
  }, [resources, isPlatformConsole]);

  return (
    <SelectPanel
      selectedValue={selectedValue || ""}
      isMulti={false}
      onChange={handleResourceSelected}
      options={options}
      label="Resource"
      openButtonProps={{
        icon: "chevron_up",
      }}
      buttonProps={{
        buttonStyle: EnumButtonStyle.Text,
        icon: "chevron_down",
        iconPosition: EnumIconPosition.Right,
      }}
      selectedItemInTextMode={true}
    />
  );
};

export default ResourceNavigationSelector;
