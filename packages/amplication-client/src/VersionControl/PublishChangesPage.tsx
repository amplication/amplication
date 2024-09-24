import {
  Button,
  DataGrid,
  DataGridColumn,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  MultiStateToggle,
  Text,
  TextInput,
  VersionTag,
} from "@amplication/ui/design-system";
import React, { useCallback, useMemo, useState } from "react";
import { inc as incrementVersion, ReleaseType, valid } from "semver";
import { useAppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { EnumResourceType, EnumResourceTypeGroup, Resource } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import "./PublishChangesPage.scss";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";

const CLASS_NAME = "publish-changes-page";

type resourceWithVersions = {
  resource: Resource;
  currentVersion: string;
  newVersion: string;
};

const TEMPLATE_COLUMNS: DataGridColumn<resourceWithVersions>[] = [
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
    resizable: false,
    sortable: false,
    renderCell: (props) => {
      return <ResourceNameLink resource={props.row.resource} />;
    },
  },
  {
    key: "currentVersion",
    name: "Current Version",
    resizable: false,
    sortable: false,
    width: 150,
    renderCell: (props) => {
      return <VersionTag version={props.row.currentVersion} state="previous" />;
    },
  },
  {
    key: "newVersion",
    name: "New Version",
    resizable: false,
    sortable: false,
    width: 150,

    renderCell: (props) => {
      return <VersionTag version={props.row.newVersion} />;
    },
  },
  {
    key: "actions",
    name: "Actions",
    resizable: false,
    sortable: false,
    width: 120,
    renderCell: (props) => {
      return <Button buttonStyle={EnumButtonStyle.Primary}>Publish</Button>;
    },
  },
];

const OTHERS_COLUMNS: DataGridColumn<Resource>[] = [
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
    resizable: false,
    sortable: false,
    renderCell: (props) => {
      return <ResourceNameLink resource={props.row} />;
    },
  },
  {
    key: "actions",
    name: "Actions",
    resizable: false,
    sortable: false,
    width: 120,
    renderCell: (props) => {
      return <Button buttonStyle={EnumButtonStyle.Primary}>Publish</Button>;
    },
  },
];

const OPTIONS: {
  label: string;
  value: ReleaseType;
}[] = [
  { label: "Major", value: "major" },
  { label: "Minor", value: "minor" },
  { label: "Patch", value: "patch" },
];

type Props = AppRouteProps;

const PublishChangesPage: React.FC<Props> = () => {
  const [version, setVersion] = useState<ReleaseType>("minor");
  const pageTitle = "Changes";
  const { currentProject } = useAppContext();

  const { pendingChangesByResource } = usePendingChanges(
    currentProject,
    EnumResourceTypeGroup.Platform
  );

  const templates = useMemo((): resourceWithVersions[] => {
    return pendingChangesByResource
      .filter(
        (x) => x.resource.resourceType === EnumResourceType.ServiceTemplate
      )
      .map((resourceChanges) => {
        const { resource } = resourceChanges;

        const currentVersion = resource?.version?.version;
        const newVersion = incrementVersion(
          !valid(currentVersion) ? "0.0.0" : currentVersion,
          version
        );

        return { resource, currentVersion, newVersion };
      });
  }, [pendingChangesByResource, version]);

  const otherResources = useMemo((): Resource[] => {
    return pendingChangesByResource
      .filter(
        (x) => x.resource.resourceType !== EnumResourceType.ServiceTemplate
      )
      .map((resourceChanges) => {
        return resourceChanges.resource;
      });
  }, [pendingChangesByResource]);

  const handleChangeType = useCallback(
    (type: ReleaseType) => {
      setVersion(type);
    },
    [setVersion]
  );

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={pageTitle}
      contentTitle="Publish Changes"
    >
      <FlexItem
        className={`${CLASS_NAME}__form`}
        direction={EnumFlexDirection.Column}
        contentAlign={EnumContentAlign.Center}
        itemsAlign={EnumItemsAlign.Stretch}
      >
        <TextInput
          rows={3}
          textarea
          textareaSize="small"
          name="message"
          label={"Version message..."}
          //disabled={commitChangesLoading}
          autoFocus
          hideLabel
          placeholder="Version message"
          autoComplete="off"
        />
        <FlexItem
          direction={EnumFlexDirection.Row}
          end={
            <Button buttonStyle={EnumButtonStyle.Primary}>Publish All</Button>
          }
        ></FlexItem>

        <Text textStyle={EnumTextStyle.H4}>Templates</Text>

        <MultiStateToggle
          className={`${CLASS_NAME}__toggle`}
          label="Version"
          name="version"
          options={OPTIONS}
          onChange={handleChangeType}
          selectedValue={version}
        />
        <DataGrid rows={templates} columns={TEMPLATE_COLUMNS} />

        <Text textStyle={EnumTextStyle.H4}>Plugins</Text>

        <DataGrid rows={otherResources} columns={OTHERS_COLUMNS} />
      </FlexItem>
    </PageContent>
  );
};

export default PublishChangesPage;
