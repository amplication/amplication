import {
  DataGridColumn,
  EnumTextStyle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import { EnumResourceType, Resource } from "../models";
import ServiceTemplateChip from "../Platform/ServiceTemplateChip";
import DeleteResourceButton from "../Workspaces/DeleteResourceButton";
import ResourceGitRepo from "../Workspaces/ResourceGitRepo";
import ResourceLastBuild from "../Workspaces/ResourceLastBuild";
import ResourceLastBuildVersion from "../Workspaces/ResourceLastBuildVersion";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import ResourcePendingChangesCount from "../Workspaces/ResourcePendingChangesCount";
import ResourceOwner from "../Workspaces/ResourceOwner";
import ProjectNameLink from "../Workspaces/ProjectNameLink";
import { ProjectFilter } from "./ProjectFilter";
import { ResourceTypeFilter } from "./ResourceTypeFilter";
import { OwnerFilter } from "./OwnerFilter";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import ResourceGitOrg from "../Workspaces/ResourceGitOrg";

export const RESOURCE_LIST_COLUMNS: DataGridColumn<Resource>[] = [
  {
    key: "resourceTypeOrBlueprint",
    name: "Type",
    width: 60,
    filterable: true,
    renderFilter: ResourceTypeFilter,
    renderCell: (props) => {
      return (
        <ResourceTypeBadge showTooltip resource={props.row} size="small" />
      );
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
    key: "projectIdFilter",
    name: "Project",
    resizable: true,
    sortable: true,
    filterable: true,
    renderFilter: ProjectFilter,
    renderCell: (props) => {
      return <ProjectNameLink project={props.row.project} />;
    },
    getValue: (row) => row.project?.name ?? "",
  },
  {
    key: "ownership",
    name: "Owner",
    resizable: true,
    sortable: true,
    filterable: true,
    renderFilter: OwnerFilter,
    renderCell: (props) => {
      return <ResourceOwner resource={props.row} />;
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
    key: "gitOrganization",
    name: "Git Organization",
    renderCell: (props) => {
      return (
        <div style={{ display: "inline-flex" }}>
          <ResourceGitOrg resource={props.row} />
        </div>
      );
    },
    resizable: true,
    sortable: true,
    getValue: (row) => row.gitRepository?.gitOrganization?.name ?? "",
  },
  {
    key: "gitRepository",
    name: "Git Repository",
    renderCell: (props) => {
      return (
        <div style={{ display: "inline-flex" }}>
          <ResourceGitRepo resource={props.row} />
        </div>
      );
    },
    resizable: true,
    sortable: true,
    getValue: (row) => row.gitRepository?.name ?? "",
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
    key: "actions",
    name: "Actions",
    sortable: false,
    renderCell: (props) => {
      return <DeleteResourceButton resource={props.row} />;
    },
    resizable: true,
  },
];
