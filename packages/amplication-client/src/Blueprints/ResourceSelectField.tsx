import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useEffect, useMemo } from "react";
import useCatalog from "../Catalog/hooks/useCatalog";
import { EnumResourceType } from "../models";
import { useAppContext } from "../context/appContext";

type Props = Omit<SelectFieldProps, "options"> & {
  blueprintId?: string;
};

const ResourceSelectField = (props: Props) => {
  const { blueprintId, ...rest } = props;

  const { catalog, setFilter } = useCatalog({ initialPageSize: 200 });

  useEffect(() => {
    setFilter({
      blueprintId: [blueprintId],
    });
  }, [blueprintId, setFilter]);

  const options = useMemo(() => {
    return catalog?.map((catalog) => ({
      value: catalog.id,
      label: catalog.name,
    }));
  }, [catalog]);

  return <SelectField {...rest} options={options} />;
};

export default ResourceSelectField;
