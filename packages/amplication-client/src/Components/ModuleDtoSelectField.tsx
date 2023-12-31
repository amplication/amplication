import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { useMemo } from "react";

type Props = Omit<SelectFieldProps, "options">;

const ModuleDtoSelectField = ({ ...props }: Props) => {
  const {
    availableDtosForCurrentResource: data,
    availableDtosForCurrentResourceError: error,
    availableDtosForCurrentResourceLoading: loading,
  } = useModuleDto();

  const options = useMemo(() => {
    if (data && data.ModuleDtos) {
      return data.ModuleDtos.map((dto) => ({
        label: dto.name,
        value: dto.id,
      }));
    }
    return [];
  }, [data]);

  return <SelectField {...props} options={options} />;
};

export default ModuleDtoSelectField;
