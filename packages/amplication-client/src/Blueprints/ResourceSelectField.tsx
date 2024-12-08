import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useEffect, useMemo } from "react";
import useCatalog from "../Catalog/hooks/useCatalog";
import useBlueprintsMap from "./hooks/useBlueprintsMap";
import { EnumResourceType } from "../models";

type Props = Omit<SelectFieldProps, "options"> & {
  blueprintId?: string;
};

const ResourceSelectField = (props: Props) => {
  const { blueprintId, ...rest } = props;

  const { blueprintsMap } = useBlueprintsMap();

  const { catalog, setFilter, pagination } = useCatalog();

  useEffect(() => {
    if (pagination.pageSize !== 200) pagination.setPageSize(200);
  }, [pagination]);

  useEffect(() => {
    const blueprint = Object.values(blueprintsMap).find(
      (blueprint) => blueprint.id === blueprintId
    );

    if (blueprint?.key === "LEGACY_SERVICE") {
      //LEGACY_SERVICE is a unique key for services that were created before the introduction of blueprints
      setFilter({
        resourceType: EnumResourceType.Service,
      });
    } else {
      setFilter({
        blueprintId: blueprintId,
      });
    }
  }, [blueprintId, blueprintsMap, setFilter]);

  const options = useMemo(() => {
    return catalog?.map((catalog) => ({
      value: catalog.id,
      label: catalog.name,
    }));
  }, [catalog]);

  return <SelectField {...rest} options={options} />;
};

export default ResourceSelectField;
