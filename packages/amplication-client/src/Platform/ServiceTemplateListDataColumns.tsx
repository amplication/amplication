import {
  DataGridColumn,
  EnumTextStyle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import { EnumResourceType, Resource } from "../models";
import ResourcePluginLogoGroup from "../Plugins/ResourcePluginLogoGroup";
import ResourceCodeEngineVersion from "../Workspaces/ResourceCodeEngineVersion";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import ResourcePendingChangesCount from "../Workspaces/ResourcePendingChangesCount";

export const SERVICE_TEMPLATE_LIST_COLUMNS: DataGridColumn<Resource>[] = [
  {
    key: "resourceType",
    name: "Type",
    width: 60,
    renderCell: (props) => {
      return <ResourceTypeBadge resource={props.row} size="small" />;
    },
  },
  {
    key: "name",
    name: "Name",
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return <ResourceNameLink resource={props.row} />;
    },
  },
  {
    key: "version",
    name: "Template Version",
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return <VersionTag version={props.row.version?.version} />;
    },
  },
  {
    key: "pendingChanges",
    name: "Pending Changes",
    width: 130,
    renderCell: (props) => {
      return <ResourcePendingChangesCount resource={props.row} />;
    },

    resizable: true,
    sortable: false,
  },
  {
    key: "codeGenerator",
    name: "Code Generator",
    renderCell: (props) => {
      return <CodeGeneratorImage resource={props.row} size="small" />;
    },
    width: 150,
    resizable: true,
    sortable: true,
    getValue: (row) =>
      row.resourceType === EnumResourceType.ServiceTemplate
        ? row.codeGenerator
        : null,
  },
  {
    key: "codeGeneratorVersion",
    name: "Code Gen Version",
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return (
        <ResourceCodeEngineVersion
          codeGeneratorStrategy={props.row.codeGeneratorStrategy}
          version={props.row.codeGeneratorVersion}
          resource={props.row}
        />
      );
    },
  },
  {
    key: "plugins",
    name: "Plugins",
    resizable: true,
    sortable: false,
    renderCell: (props) => {
      return <ResourcePluginLogoGroup resource={props.row} />;
    },
  },
  {
    key: "description",
    name: "Description",
    renderCell: (props) => {
      return (
        <Text textStyle={EnumTextStyle.Description}>
          {props.row.description}
        </Text>
      );
    },
    resizable: true,
    sortable: true,
  },
];
