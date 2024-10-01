import {
  DataGridColumn,
  EnumTextStyle,
  Text,
  UserAndTime,
  VersionTag,
} from "@amplication/ui/design-system";
import { ResourceVersion } from "../models";

export const RESOURCE_VERSION_LIST_COLUMNS: DataGridColumn<ResourceVersion>[] =
  [
    {
      key: "version",
      name: "Version",
      resizable: true,
      sortable: true,
      width: 150,

      renderCell: (props) => {
        return <VersionTag version={props.row.version} />;
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
            overrideTooltipDirection="e"
          />
        );
      },
      width: 250,
      resizable: true,
      sortable: true,
    },
    {
      key: "message",
      name: "message",
      renderCell: (props) => {
        return (
          <Text textStyle={EnumTextStyle.Description}>{props.row.message}</Text>
        );
      },
      resizable: true,
      sortable: true,
    },
  ];
