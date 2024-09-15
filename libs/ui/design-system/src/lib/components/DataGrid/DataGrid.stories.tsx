import { Meta } from "@storybook/react";
import { DataGrid } from "./DataGrid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { useMemo } from "react";
import { ColumnOrColumnGroup } from "react-data-grid";

export default {
  title: "DataGrid",
  component: DataGrid,
} as Meta;

export const Default = {
  render: (props: any) => {
    const { data } = useDemoData({
      dataSet: "Commodity",

      rowLength: 40,
      maxColumns: 10,
    });

    const columns = useMemo((): ColumnOrColumnGroup<any>[] => {
      return data.columns.map((column) => ({
        key: column.field,
        name: column.field,
        resizable: true,
        sortable: true,
      }));
    }, [data.columns]);

    return (
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={data.rows} {...props} columns={columns}>
          hello
        </DataGrid>
      </div>
    );
  },
};
