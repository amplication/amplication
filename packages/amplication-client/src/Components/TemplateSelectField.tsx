import {
  SelectPanelField,
  SelectPanelFieldProps,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import useAvailableServiceTemplates from "../ServiceTemplate/hooks/useAvailableServiceTemplates";

type Props = Omit<SelectPanelFieldProps, "options"> & {
  projectId: string;
  onChange?: (value: string) => void;
};

const DEFAULT_COLOR = "#FFFFFF";

const TemplateSelectField = ({ projectId, ...rest }: Props) => {
  const { availableTemplates } = useAvailableServiceTemplates(projectId);

  const options = useMemo(() => {
    return availableTemplates
      .filter((serviceTemplate) => serviceTemplate.blueprint?.enabled || true)
      .map((serviceTemplate) => ({
        value: serviceTemplate.id,
        label: serviceTemplate.name,
        description: serviceTemplate.description,
        color: DEFAULT_COLOR,
      }));
  }, [availableTemplates]);

  return <SelectPanelField options={options} {...rest} />;
};

export default TemplateSelectField;
