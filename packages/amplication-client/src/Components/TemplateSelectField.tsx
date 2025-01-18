import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useMemo } from "react";
import useAvailableServiceTemplates from "../ServiceTemplate/hooks/useAvailableServiceTemplates";

type Props = Omit<SelectFieldProps, "options"> & {
  projectId: string;
};

const TemplateSelectField = ({ projectId, ...rest }: Props) => {
  const { availableTemplates } = useAvailableServiceTemplates(projectId);

  const options = useMemo(() => {
    return availableTemplates.map((serviceTemplate) => ({
      value: serviceTemplate.id,
      label: serviceTemplate.name,
    }));
  }, [availableTemplates]);

  return <SelectField options={options} {...rest} />;
};

export default TemplateSelectField;
