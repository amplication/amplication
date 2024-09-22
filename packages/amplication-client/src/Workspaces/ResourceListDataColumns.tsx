import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { EnumResourceType, Resource } from "../models";
import DeleteResourceButton from "./DeleteResourceButton";
import ResourceGitRepo from "./ResourceGitRepo";
import ResourceLastBuild from "./ResourceLastBuild";
import ResourceNameLink from "./ResourceNameLink";
import ResourceLastBuildVersion from "./ResourceLastBuildVersion";
import { DataGridColumn } from "@amplication/ui/design-system";
import ServiceTemplateChip from "../Platform/ServiceTemplateChip";

export const RESOURCE_LIST_COLUMNS: DataGridColumn<Resource>[] = [
  {
    key: "resourceType",
    name: "Type",
    width: 60,
    renderCell: (props) => {
      return <ResourceCircleBadge type={props.row.resourceType} size="small" />;
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
    key: "codeGenerator",
    name: "Code Generator",
    renderCell: (props) => {
      return <CodeGeneratorImage resource={props.row} size="small" />;
    },
    width: 150,
    resizable: true,
    sortable: true,
    getValue: (row) =>
      row.resourceType === EnumResourceType.Service ? row.codeGenerator : null,
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
  {
    key: "template",
    name: "Template",
    sortable: true,
    width: 150,
    renderCell: (props) => {
      return (
        <ServiceTemplateChip serviceTemplate={props.row.serviceTemplate} />
      );
    },
    getValue: (row) => (row.serviceTemplate ? row.serviceTemplate.name : ""),
    resizable: true,
  },
  {
    key: "actions",
    name: "Actions",
    sortable: false,
    renderCell: (props) => {
      return <DeleteResourceButton resource={props.row} />;
    },
    resizable: true,
  },
];
