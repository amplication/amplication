import {
  DataGridFilter,
  DataGridRenderFilterProps,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

export const BlueprintFilter = ({
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
    const blueprintOptions = Object.keys(blueprintsMap)
      .map((key) => {
        const blueprint = blueprintsMap[key];
        return {
          value: blueprint.id,
          label: blueprint.name,
          color: blueprint.color,
        };
      })
      .sort((a, b) => {
        return a.label.localeCompare(b.label);
      });

    return blueprintOptions;
  }, [blueprintsMap]);

  return (
    <>
      <DataGridFilter
        filterKey={columnKey}
        filterLabel={"Blueprint"}
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
