import { DataGridFilterProps, OptionItem } from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import { useAppContext } from "../context/appContext";
import { CatalogFilter } from "./CatalogFilter";

export const ProjectFilter = ({
  selectedValue,
  label,
  onChange,
  onRemove,
  columnKey,
}: DataGridFilterProps) => {
  const { projectsList } = useAppContext();

  const options = useMemo(() => {
    return projectsList.map(
      (project): OptionItem => ({
        value: project.id,
        label: project.name,
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
      <CatalogFilter
        filterKey={columnKey}
        filterLabel={label}
        options={options}
        selectedValue={selectedValue}
        onChange={handleOnChange}
        onRemove={handleOnRemove}
      />
    </>
  );
};
