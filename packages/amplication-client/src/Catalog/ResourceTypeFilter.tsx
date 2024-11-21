import {
  DataGridFilter,
  DataGridRenderFilterProps,
} from "@amplication/ui/design-system";
import { resourceThemeMap } from "../Resource/constants";

const OPTIONS = Object.keys(resourceThemeMap).map((key) => {
  const theme = resourceThemeMap[key];
  return {
    value: key,
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
  return (
    <>
      <DataGridFilter
        filterKey={columnKey}
        filterLabel={"Resource Type"}
        options={OPTIONS}
        selectedValue={selectedValue}
        onChange={onChange}
        onRemove={onRemove}
        disabled={disabled}
      />
    </>
  );
};
