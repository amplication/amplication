import {
  DataGridFilter,
  DataGridRenderFilterProps,
  OptionItem,
} from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import { useAppContext } from "../context/appContext";

export const ProjectFilter = ({
  selectedValue,
  label,
  onChange,
  onRemove,
  columnKey,
  disabled,
}: DataGridRenderFilterProps) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList.map(
      (project): OptionItem => ({
        value: project.id,
        label: project.name,
        color: "#FFF",
        description: project.description,
      })
    );
  }, [projectsList]);

  const handleOnRemove = useCallback(() => {
    onRemove(columnKey);
  }, [columnKey, onRemove]);

  const handleOnChange = useCallback(
    (key: string, value: string) => {
      onChange(columnKey, value);
    },
    [columnKey, onChange]
  );

  return (
    <>
      <DataGridFilter
        filterKey={columnKey}
        filterLabel={label}
        options={options}
        selectedValue={selectedValue}
        onChange={handleOnChange}
        onRemove={handleOnRemove}
        disabled={disabled}
        isMulti={true}
      />
    </>
  );
};
