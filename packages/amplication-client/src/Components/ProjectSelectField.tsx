import {
  SelectPanelField,
  SelectPanelFieldProps,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

type Props = Omit<SelectPanelFieldProps, "options">;

const DEFAULT_COLOR = "#FFFFFF";

const ProjectSelectField = (props: Props) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList?.map((project) => ({
      value: project.id,
      label: project.name,
      color: DEFAULT_COLOR,
      description: project.description,
    }));
  }, [projectsList]);

  return <SelectPanelField {...props} options={options} />;
};

export default ProjectSelectField;
