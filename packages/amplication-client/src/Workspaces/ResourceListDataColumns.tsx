import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { ColumnOrColumnGroup } from "react-data-grid";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { Resource } from "../models";
import DeleteResourceButton from "./DeleteResourceButton";
import ResourceGitRepo from "./ResourceGitRepo";
import ResourceLastBuild from "./ResourceLastBuild";
import ResourceNameLink from "./ResourceNameLink";

export const RESOURCE_LIST_COLUMNS: ColumnOrColumnGroup<Resource>[] = [
  {
    key: "resourceType",
    name: "Type",
    width: 50,
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
  {
    key: "lastBuild",
    name: "Last Build",
    width: 150,
    renderCell: (props) => {
      return (
        <div style={{ display: "inline-flex" }}>
          {" "}
          <ResourceLastBuild hideLabel resource={props.row} />
        </div>
      );
    },
    resizable: true,
    sortable: true,
  },
  {
    key: "actions",
    name: "Actions",
    sortable: false,
    width: 150,
    renderCell: (props) => {
      return <DeleteResourceButton resource={props.row} />;
    },
    resizable: true,
  },
];
