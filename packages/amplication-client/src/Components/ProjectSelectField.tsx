import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

type Props = Omit<SelectFieldProps, "options">;

const ProjectSelectField = (props: Props) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList?.map((project) => ({
      value: project.id,
      label: project.name,
    }));
  }, [projectsList]);

  return <SelectField {...props} options={options} />;
};

export default ProjectSelectField;
