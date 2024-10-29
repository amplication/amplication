import useLocalStorage from "react-use-localstorage";
import { DataGridColumn } from "@amplication/ui/design-system";
import { useEffect, useState } from "react";

type SavedColumnData = {
  key: string;
  hidden: boolean;
};

export default function useDataGridColumnFilter<T>(
  initialColumns: DataGridColumn<T>[],
  localStorageKey
) {
  const [columns, setColumns] = useState(initialColumns);

  const [savedColumnData, setSavedColumnData] = useLocalStorage(
    localStorageKey,
    ""
  );

  useEffect(() => {
    const savedColumns: SavedColumnData[] = columns.map((column) => {
      return {
        key: column.key,
        hidden: column.hidden,
      };
    });
    setSavedColumnData(JSON.stringify(savedColumns));
  }, [columns]);

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
      setColumns(newColumns);
    }
  }, []);

  return {
    columns,
    setColumns,
  };
}
