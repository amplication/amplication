import useLocalStorage from "react-use-localstorage";
import { DataGridColumn } from "@amplication/ui/design-system";
import { useCallback, useEffect, useState } from "react";

type SavedColumnData = {
  key: string;
  hidden: boolean;
  order: number;
};

export default function useDataGridColumnFilter<T>(
  initialColumns: DataGridColumn<T>[],
  localStorageKey
) {
  const [columns, setColumns] = useState(initialColumns);

  const [savedColumnData, setSavedColumnData] = useLocalStorage(
    localStorageKey,
    "[]"
  );

  //save the data to local storage every time the columns change
  useEffect(() => {
    const savedColumns: SavedColumnData[] = columns.map((column, index) => {
      return {
        key: column.key,
        hidden: column.hidden,
        order: index,
      };
    });

    const currentSavedColumns = JSON.parse(savedColumnData);

    //merge the missing fields from currentSavedColumns to savedColumns
    //to avoid losing the data when the columns for custom property are loaded
    currentSavedColumns.forEach((currentSavedColumn) => {
      const savedColumn = savedColumns.find(
        (savedColumn) => savedColumn.key === currentSavedColumn.key
      );
      if (!savedColumn) {
        savedColumns.push(currentSavedColumn);
      }
    });

    setSavedColumnData(JSON.stringify(savedColumns));
  }, [columns, savedColumnData, setSavedColumnData]);

  //load the data from local storage when the component mounts
  useEffect(() => {
    if (savedColumnData) {
      const savedColumns: SavedColumnData[] = JSON.parse(savedColumnData);

      const newColumns = columns.map((column) => {
        const savedColumn = savedColumns.find(
          (savedColumn) => savedColumn.key === column.key
        );
        return {
          ...column,
          hidden: savedColumn ? savedColumn.hidden : column.hidden,
        };
      });

      newColumns.sort((a, b) => {
        const aOrder = savedColumns.find(
          (savedColumn) => savedColumn.key === a.key
        )?.order;
        const bOrder = savedColumns.find(
          (savedColumn) => savedColumn.key === b.key
        )?.order;
        return aOrder - bOrder;
      });

      setColumns(newColumns);
    }
  }, []);

  //reorder the columns
  const onColumnsReorder = useCallback(
    (sourceKey: string, targetKey: string) => {
      const sourceColumnOrderIndex = columns.findIndex(
        (column) => column.key === sourceKey
      );
      const targetColumnOrderIndex = columns.findIndex(
        (column) => column.key === targetKey
      );

      const newColumns = [...columns];
      const sourceColumn = newColumns[sourceColumnOrderIndex];
      newColumns.splice(sourceColumnOrderIndex, 1);
      newColumns.splice(targetColumnOrderIndex, 0, sourceColumn);

      setColumns(newColumns);
    },
    [columns]
  );

  return {
    columns,
    setColumns,
    onColumnsReorder,
  };
}
