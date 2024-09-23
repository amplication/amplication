import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { EnumResourceType, Resource } from "../models";
import DeleteResourceButton from "../Workspaces/DeleteResourceButton";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import { DataGridColumn } from "@amplication/ui/design-system";
import NewServiceFromTemplateButton from "../ServiceTemplate/NewServiceFromTemplateButton";

export const SERVICE_TEMPLATE_LIST_COLUMNS: DataGridColumn<Resource>[] = [
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
      row.resourceType === EnumResourceType.ServiceTemplate
        ? row.codeGenerator
        : null,
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
    key: "actions",
    name: "Actions",
    sortable: false,
    width: 150,
    renderCell: (props) => {
      return (
        <FlexItem direction={EnumFlexDirection.Row} gap={EnumGapSize.Small}>
          <NewServiceFromTemplateButton serviceTemplateId={props.row.id} />
          <DeleteResourceButton resource={props.row} />
        </FlexItem>
      );
    },
    resizable: true,
  },
];
