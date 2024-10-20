import {
  DataGridColumn,
  EnumTextStyle,
  Text,
  UserAndTime,
} from "@amplication/ui/design-system";
import { ResourceVersion } from "../models";
import ResourceVersionLink from "./ResourceVersionLink";

export const RESOURCE_VERSION_LIST_COLUMNS: DataGridColumn<ResourceVersion>[] =
  [
    {
      key: "version",
      name: "Version",
      resizable: true,
      sortable: true,
      width: 150,

      renderCell: (props) => {
        return <ResourceVersionLink resourceVersion={props.row} />;
      },
    },
    {
      key: "createdAt",
      name: "Date",
      renderCell: (props) => {
        return (
          <UserAndTime
            account={props.row.createdBy?.account}
            time={props.row.createdAt}
          />
        );
      },
      width: 250,
      resizable: true,
      sortable: true,
    },
    {
      key: "message",
      name: "Message",
      renderCell: (props) => {
        return (
          <Text textStyle={EnumTextStyle.Description}>{props.row.message}</Text>
        );
      },
      resizable: true,
      sortable: true,
    },
  ];
