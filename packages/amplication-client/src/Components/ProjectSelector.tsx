import {
  EnumButtonStyle,
  EnumIconPosition,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

type Props = {
  onChange: (value: string) => void;
  selectedValue: string;
};

const ProjectSelector = ({ onChange, selectedValue }: Props) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList?.map((project) => ({
      value: project.id,
      label: project.name,
    }));
  }, [projectsList]);

  return (
    <SelectPanel
      selectedValue={selectedValue || ""}
      isMulti={false}
      onChange={onChange}
      options={options}
      label="Project"
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

export default ProjectSelector;
