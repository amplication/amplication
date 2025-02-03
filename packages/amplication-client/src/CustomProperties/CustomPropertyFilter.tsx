import {
  DataGridFilter,
  DataGridRenderFilterProps,
  OptionItem,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";

export const CustomPropertyFilter = ({
  columnKey,
  selectedValue,
  onChange,
  onRemove,
  initialOpen,
}: DataGridRenderFilterProps) => {
  const { customPropertiesMap } = useAppContext();
  const customProperty = customPropertiesMap[columnKey];

  const options = useMemo(() => {
    return customProperty.options.map(
      (option): OptionItem => ({
        value: option.value,
        label: option.value,
        color: option.color,
      })
    );
  }, [customProperty.options]);

  return (
    <DataGridFilter
      filterKey={columnKey}
      filterLabel={customProperty.name}
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      onRemove={onRemove}
      isMulti={false}
      showEmptyItem={true}
      emptyItemLabel="All"
      initialOpen={initialOpen}
    />
  );
};
