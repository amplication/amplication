import { Meta } from "@storybook/react";
import { DataGrid } from "./DataGrid";
import { useDemoData } from "@mui/x-data-grid-generator";

export default {
  title: "DataGrid",
  component: DataGrid,
} as Meta;

export const Default = {
  render: (props: any) => {
    const { data } = useDemoData({
      dataSet: "Commodity",

      rowLength: 40,
      maxColumns: 22,
    });

    return (
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid {...data} {...props}>
          hello
        </DataGrid>
      </div>
    );
  },
};
