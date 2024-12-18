import {
  EnumButtonStyle,
  EnumIconPosition,
  OptionItem,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import { EnumResourceType } from "../models";

type Props = {
  onChange: (value: string) => void;
  selectedValue: string;
  allResourcesItem?: OptionItem;
  isPlatformConsole?: boolean;
};

const ResourceSelector = ({
  onChange,
  selectedValue,
  allResourcesItem,
  isPlatformConsole,
}: Props) => {
  const { resources } = useAppContext();

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
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (allResourcesItem) {
      return [allResourcesItem, ...projects];
    } else {
      return projects;
    }
  }, [resources, allResourcesItem, isPlatformConsole]);

  return (
    <SelectPanel
      selectedValue={selectedValue || ""}
      isMulti={false}
      onChange={onChange}
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
    />
  );
};

export default ResourceSelector;
