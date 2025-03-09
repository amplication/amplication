import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useMemo } from "react";
import useCatalog from "../Catalog/hooks/useCatalog";

type Props = Omit<SelectFieldProps, "options"> & {
  blueprintId?: string;
};

const ResourceSelectField = (props: Props) => {
  const { blueprintId, ...rest } = props;

  const { catalog } = useCatalog({
    initialPageSize: 200,
    fetchPolicy: "cache-and-network",
    initialFilters: {
      blueprintId: [blueprintId],
    },
  });

  const options = useMemo(() => {
    return catalog?.map((catalog) => ({
      value: catalog.id,
      label: catalog.name,
    }));
  }, [catalog]);

  return <SelectField {...rest} options={options} />;
};

export default ResourceSelectField;
