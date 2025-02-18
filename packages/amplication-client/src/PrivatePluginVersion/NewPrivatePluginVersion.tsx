import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Label,
  MultiStateToggle,
  Panel,
  Snackbar,
  TabContentTitle,
  VersionTag,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { inc as incrementVersion, ReleaseType, rsort, valid } from "semver";
import { Button, EnumButtonStyle } from "../Components/Button";
import { SEMVER_OPTIONS } from "../VersionControl/PublishChangesPage";
import * as models from "../models";
import { formatError } from "../util/error";
import "./NewPrivatePluginVersion.scss";
import usePrivatePluginVersion from "./hooks/usePrivatePluginVersion";

type Props = {
  privatePlugin: models.PrivatePlugin;
  onVersionAdd?: (privatePlugin: models.PrivatePlugin) => void;
  disabled?: boolean;
};
const NO_VERSION = "0.0.0";
const CLASS_NAME = "new-private-plugin-version";

const NewPrivatePluginVersion = ({
  privatePlugin,
  onVersionAdd,
  disabled,
}: Props) => {
  const {
    createPrivatePluginVersion,
    createPrivatePluginVersionError: error,
    createPrivatePluginVersionLoading: loading,
  } = usePrivatePluginVersion();

  const [version, setVersion] = useState<string>("minor");

  const [newVersion, setNewVersion] = useState<string | null>(null);

  const latestVersion = useMemo(() => {
    if (!privatePlugin?.versions) {
      return NO_VERSION;
    }

    const versions = privatePlugin?.versions.map(
      (version) => valid(version.version) || NO_VERSION
    );
    return rsort(versions)[0];
  }, [privatePlugin?.versions]);

  useEffect(() => {
    if (latestVersion) {
      setNewVersion(incrementVersion(latestVersion, version as ReleaseType));
    }
  }, [latestVersion, version]);

  const handleSubmit = useCallback(() => {
    createPrivatePluginVersion({
      variables: {
        data: {
          version: newVersion,
          privatePlugin: { connect: { id: privatePlugin.id } },
        },
      },
    })
      .catch(console.error)
      .then(() => {
        if (onVersionAdd) {
          onVersionAdd(privatePlugin);
        }
      });
  }, [createPrivatePluginVersion, newVersion, privatePlugin, onVersionAdd]);

  const errorMessage = formatError(error);

  return (
    <Panel panelStyle={EnumPanelStyle.Surface} style={{ flex: 1 }}>
      <TabContentTitle title="Add New Version" />
      <FlexItem direction={EnumFlexDirection.Column} className={CLASS_NAME}>
        <MultiStateToggle
          className={`${CLASS_NAME}__toggle`}
          label="Version"
          name="version"
          options={SEMVER_OPTIONS}
          onChange={setVersion}
          selectedValue={version}
        />
        <FlexItem
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Start}
          end={
            <FlexItem direction={EnumFlexDirection.Row}>
              <Button
                buttonStyle={EnumButtonStyle.Outline}
                onClick={() => handleSubmit()}
                disabled={loading || disabled}
              >
                Add Version
              </Button>
            </FlexItem>
          }
        >
          <Label text="New version" />
          <VersionTag version={newVersion} />
        </FlexItem>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </FlexItem>
    </Panel>
  );
};

export default NewPrivatePluginVersion;
