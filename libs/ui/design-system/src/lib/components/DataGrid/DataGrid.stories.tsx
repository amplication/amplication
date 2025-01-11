import { Meta } from "@storybook/react";
import { DataGrid } from "./DataGrid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { useMemo } from "react";
import { ColumnOrColumnGroup } from "react-data-grid";
import { DataGridRowExpander } from "./DataGridRowExpander";

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

export const WithExpandRow = {
  render: (props: any) => {
    const { data } = useDemoData({
      dataSet: "Commodity",

      rowLength: 40,
      maxColumns: 10,
    });

    const columns = useMemo((): ColumnOrColumnGroup<any>[] => {
      const cols = data.columns.map((column) => ({
        key: column.field,
        name: column.field,
        resizable: true,
        sortable: true,
      }));

      return [
        {
          key: "expanded",
          name: "",
          minWidth: 30,
          width: 30,
          colSpan(args) {
            return args.type === "ROW" && args.row.dataGridRowType === "DETAIL"
              ? 1000 //expand all columns
              : undefined;
          },

          renderCell({ row, tabIndex, onRowChange }) {
            if (row.dataGridRowType === "DETAIL") {
              return <div>Details Row ----</div>;
            }

            return (
              <DataGridRowExpander
                expanded={row.dataGridRowExpanded}
                tabIndex={tabIndex}
                onCellExpand={() => {
                  onRowChange({
                    ...row,
                    dataGridRowExpanded: !row.dataGridRowExpanded,
                  });
                }}
              />
            );
          },
        },
        ...cols,
      ];
    }, [data.columns]);

    return (
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={data.rows}
          {...props}
          columns={columns}
          enableRowDetails
        >
          hello
        </DataGrid>
      </div>
    );
  },
};
