import {
  DataGridFilter,
  DataGridRenderFilterProps,
} from "@amplication/ui/design-system";
import { resourceThemeMap } from "../Resource/constants";
import { EnumResourceType } from "../models";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

const RESOURCE_TYPE_PREFIX = "resourceType_";
const BLUEPRINT_PREFIX = "blueprint_";

const OPTIONS = Object.keys(resourceThemeMap)
  .filter(
    (type) =>
      type !== EnumResourceType.ProjectConfiguration &&
      type !== EnumResourceType.Component &&
      type !== EnumResourceType.PluginRepository &&
      type !== EnumResourceType.ServiceTemplate
  )
  .map((key) => {
    const theme = resourceThemeMap[key];
    return {
      value: `${RESOURCE_TYPE_PREFIX}${key}`,
      label: theme.name,
      color: theme.color,
    };
  });

export const ResourceTypeFilter = ({
  selectedValue,
  label,
  onChange,
  onRemove,
  columnKey,
  disabled,
}: DataGridRenderFilterProps) => {
  const {
    blueprintsMap: { blueprintsMap },
  } = useAppContext();

  const options = useMemo(() => {
    const blueprintOptions = Object.keys(blueprintsMap).map((key) => {
      const blueprint = blueprintsMap[key];
      return {
        value: `${BLUEPRINT_PREFIX}${blueprint.id}`,
        label: blueprint.name,
        color: blueprint.color,
      };
    });

    return [...OPTIONS, ...blueprintOptions].sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
  }, [blueprintsMap]);

  return (
    <>
      <DataGridFilter
        filterKey={columnKey}
        filterLabel={"Resource Type"}
        options={options}
        selectedValue={selectedValue}
        onChange={onChange}
        onRemove={onRemove}
        disabled={disabled}
        isMulti={true}
      />
    </>
  );
};
