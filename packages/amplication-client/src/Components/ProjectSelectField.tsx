import {
  SelectPanelField,
  SelectPanelFieldProps,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import { PROJECT_SELECTOR_COLOR } from "./ProjectSelector";

type Props = Omit<SelectPanelFieldProps, "options">;

const ProjectSelectField = (props: Props) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList?.map((project) => ({
      value: project.id,
      label: project.name,
      color: PROJECT_SELECTOR_COLOR,
      description: project.description,
    }));
  }, [projectsList]);

  return <SelectPanelField {...props} options={options} />;
};

export default ProjectSelectField;
