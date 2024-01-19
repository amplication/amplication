import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useContext, useMemo } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { AppContext } from "../context/appContext";

type Props = Omit<SelectFieldProps, "options">;

const ModuleDtoSelectField = ({ ...props }: Props) => {
  const {
    availableDtosForCurrentResource: data,
    availableDtosForCurrentResourceError: error,
    availableDtosForCurrentResourceLoading: loading,
  } = useModuleDto();

  const { resources } = useContext(AppContext);

  const resourceNameDictionary = useMemo(() => {
    if (!resources) return {};
    return resources.reduce((acc, resource) => {
      acc[resource.id] = resource.name;
      return acc;
    }, {});
  }, [resources]);

  const options = useMemo(() => {
    if (data && data.moduleDtos) {
      return data.moduleDtos.map((dto) => ({
        label: `${dto.name}`,
        group: `${resourceNameDictionary[dto.resourceId] + "\\"}${
          dto.parentBlock.displayName
        }`,
        value: dto.id,
      }));
    }
    return [];
  }, [data, resourceNameDictionary]);

  return <SelectField {...props} options={options} />;
};

export default ModuleDtoSelectField;
