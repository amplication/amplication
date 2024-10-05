import {
  DataGridColumn,
  EnumVersionTagState,
  VersionTag,
} from "@amplication/ui/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { OutdatedVersionAlert } from "../models";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";

export const COLUMNS: DataGridColumn<OutdatedVersionAlert>[] = [
  {
    key: "resourceType",
    name: "Type",
    width: 60,
    renderCell: (props) => {
      return (
        <ResourceCircleBadge
          type={props.row.resource.resourceType}
          size="small"
        />
      );
    },
  },
  {
    key: "name",
    name: "Name",
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return <ResourceNameLink resource={props.row.resource} />;
    },
  },
  {
    key: "type",
    name: "Type",
    resizable: true,
    sortable: true,
    width: 200,
    renderCell: (props) => {
      return <OutdatedVersionAlertType outdatedVersionAlert={props.row} />;
    },
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
      return <OutdatedVersionAlertStatus outdatedVersionAlert={props.row} />;
    },
  },
];
