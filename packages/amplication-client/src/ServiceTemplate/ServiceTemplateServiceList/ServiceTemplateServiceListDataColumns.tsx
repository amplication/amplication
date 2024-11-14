import {
  DataGridColumn,
  EnumTextStyle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import ResourceTypeBadge from "../../Components/ResourceTypeBadge";
import { Resource } from "../../models";
import ResourceGitRepo from "../../Workspaces/ResourceGitRepo";
import ResourceLastBuild from "../../Workspaces/ResourceLastBuild";
import ResourceLastBuildVersion from "../../Workspaces/ResourceLastBuildVersion";
import ResourceNameLink from "../../Workspaces/ResourceNameLink";

export const RESOURCE_LIST_COLUMNS: DataGridColumn<Resource>[] = [
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
    key: "templateVersion",
    name: "Template Version",
    sortable: true,
    width: 150,
    renderCell: (props) => {
      return (
        <>
          {props.row.serviceTemplateVersion && (
            <VersionTag version={props.row.serviceTemplateVersion} />
          )}
        </>
      );
    },
    getValue: (row) =>
      row.serviceTemplateVersion ? row.serviceTemplateVersion : "",
    resizable: true,
  },
  {
    key: "git",
    name: "Repository",
    renderCell: (props) => {
      return (
        <div style={{ display: "inline-flex" }}>
          <ResourceGitRepo resource={props.row} />
        </div>
      );
    },
    resizable: true,
    sortable: true,
    getValue: (row) =>
      row.gitRepository?.gitOrganization?.name && row.gitRepository?.name,
  },
  {
    key: "description",
    name: "Description",
    width: 200,
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
  {
    key: "lastBuild",
    name: "Last Build",
    width: 150,
    renderCell: (props) => {
      return (
        <div style={{ display: "inline-flex" }}>
          <ResourceLastBuild hideLabel resource={props.row} />
        </div>
      );
    },
    getValue: (row) =>
      row.builds[0] ? new Date(row.builds[0]?.createdAt).getTime() : 0,
    resizable: true,
    sortable: true,
  },
  {
    key: "codeGeneratorVersion",
    name: "Code Gen Version",
    resizable: true,
    sortable: true,
    renderCell: (props) => {
      return <ResourceLastBuildVersion resource={props.row} />;
    },
    getValue: (row) => row.builds[0]?.codeGeneratorVersion ?? "",
  },
];
