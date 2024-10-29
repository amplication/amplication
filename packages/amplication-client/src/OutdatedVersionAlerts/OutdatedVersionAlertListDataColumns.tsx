import {
  DataGridColumn,
  EnumTextStyle,
  EnumVersionTagState,
  Text,
  TimeSince,
  VersionTag,
} from "@amplication/ui/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { EnumResourceType, OutdatedVersionAlert } from "../models";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";
import AlertLink from "./AlertLink";

export const COLUMNS: DataGridColumn<OutdatedVersionAlert>[] = [
  {
    key: "resourceType",
    name: "Type",
    width: 60,
    renderCell: (props) => {
      return (
        <ResourceCircleBadge
          type={props.row.resource?.resourceType || EnumResourceType.Service}
          size="small"
        />
      );
    },
  },
  {
    key: "name",
    name: "Name",
    resizable: true,
    sortable: false,
    renderCell: (props) => {
      return (
        <>
          {!props.row.resource ? (
            "(unavailable)"
          ) : (
            <ResourceNameLink resource={props.row.resource} />
          )}
        </>
      );
    },
  },
  {
    key: "createdAt",
    name: "Created",
    resizable: true,
    sortable: true,
    width: 100,
    renderCell: (props) => {
      return <TimeSince time={new Date(props.row.createdAt)} />;
    },
  },
  {
    key: "type",
    name: "Alert Type",
    resizable: true,
    sortable: true,
    width: 150,
    renderCell: (props) => {
      return <OutdatedVersionAlertType type={props.row.type} />;
    },
  },
  {
    key: "blockDisplayName",
    name: "Plugin", //we only support alerts for blocks of plugin installation - we may need to change this in the future
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return (
        <Text textStyle={EnumTextStyle.Description}>
          {props.row.block?.displayName}
        </Text>
      );
    },
    getValue: (row) => row.block?.displayName || "",
  },
  {
    key: "outdatedVersion",
    name: "Outdated Version",
    resizable: true,
    sortable: true,
    width: 200,
    renderCell: (props) => {
      return (
        <VersionTag
          version={props.row.outdatedVersion}
          state={EnumVersionTagState.UpdateAvailable}
        />
      );
    },
  },
  {
    key: "latestVersion",
    name: "Latest Version",
    resizable: true,
    sortable: true,
    width: 200,
    renderCell: (props) => {
      return (
        <VersionTag
          version={props.row.latestVersion}
          state={EnumVersionTagState.Current}
        />
      );
    },
  },

  {
    key: "status",
    name: "Status",
    resizable: true,
    sortable: true,
    width: 200,
    renderCell: (props) => {
      return <OutdatedVersionAlertStatus status={props.row.status} />;
    },
  },

  {
    key: "actions",
    name: "Action",
    resizable: false,
    sortable: false,
    width: 100,
    renderCell: (props) => {
      return <AlertLink alert={props.row} />;
    },
  },
];
