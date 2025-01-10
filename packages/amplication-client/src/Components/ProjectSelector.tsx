import {
  EnumButtonStyle,
  EnumIconPosition,
  OptionItem,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

type Props = {
  onChange: (value: string) => void;
  selectedValue: string;
  allProjectsItem?: OptionItem;
  buttonStyle?: EnumButtonStyle;
  label?: string;
};

const ProjectSelector = ({
  onChange,
  selectedValue,
  allProjectsItem,
  buttonStyle = EnumButtonStyle.Text,
  label = "Project",
}: Props) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    const projects = projectsList
      ?.map((project) => ({
        value: project.id,
        label: project.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (allProjectsItem) {
      return [allProjectsItem, ...projects];
    } else {
      return projects;
    }
  }, [projectsList, allProjectsItem]);

  return (
    <SelectPanel
      selectedValue={selectedValue || ""}
      isMulti={false}
      onChange={onChange}
      options={options}
      label={label}
      openButtonProps={{
        icon: "chevron_up",
      }}
      buttonProps={{
        buttonStyle: buttonStyle,
        icon: "chevron_down",
        iconPosition: EnumIconPosition.Right,
      }}
    />
  );
};

export default ProjectSelector;
