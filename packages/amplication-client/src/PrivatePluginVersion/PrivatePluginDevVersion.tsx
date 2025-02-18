import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Panel,
  Snackbar,
  TabContentTitle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import * as models from "../models";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import "./NewPrivatePluginVersion.scss";
import usePrivatePluginVersion from "./hooks/usePrivatePluginVersion";
import { DEV_VERSION_TAG } from "../Plugins/constant";

type Props = {
  privatePlugin: models.PrivatePlugin;
  onChange?: (privatePlugin: models.PrivatePlugin) => void;
  disabled?: boolean;
};

const PrivatePluginDevVersion = ({
  privatePlugin,
  onChange,
  disabled,
}: Props) => {
  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: true });

  const {
    createPrivatePluginVersion,
    createPrivatePluginVersionError: error,
    updatePrivatePluginVersion,
    updatePrivatePluginVersionError: updateError,
  } = usePrivatePluginVersion();

  const devVersion = useMemo(() => {
    if (!privatePlugin) return null;
    return privatePlugin.versions?.find((v) => v.version.includes("dev"));
  }, [privatePlugin]);

  const handleEnableDevVersion = useCallback(
    (event, checked) => {
      if (!devVersion) {
        createPrivatePluginVersion({
          variables: {
            data: {
              version: DEV_VERSION_TAG,
              privatePlugin: { connect: { id: privatePlugin.id } },
            },
          },
        })
          .catch(console.error)
          .then(() => {
            onChange && onChange(privatePlugin);
          });
      } else {
        updatePrivatePluginVersion({
          variables: {
            where: {
              version: devVersion.version,
              privatePlugin: {
                id: privatePlugin.id,
              },
            },
            data: {
              enabled: checked,
            },
          },
        })
          .catch(console.error)
          .then(() => {
            onChange && onChange(privatePlugin);
          });
      }
    },
    [
      devVersion,
      createPrivatePluginVersion,
      privatePlugin,
      onChange,
      updatePrivatePluginVersion,
    ]
  );

  const errorMessage = formatError(error) || formatError(updateError);

  return (
    <Panel panelStyle={EnumPanelStyle.Surface} style={{ flex: 1 }}>
      <TabContentTitle title="Dev Version" />
      <Text textStyle={EnumTextStyle.Description}>
        Use dev version to test the plugin during development. When choosing a
        dev version, the plugin code will be pulled from the base branch set at
        the{" "}
        <Link to={`${baseUrl}/private-plugins/git-settings`}>
          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.ThemeTurquoise}
          >
            Git Settings
          </Text>
        </Link>
      </Text>
      <FlexItem
        direction={EnumFlexDirection.Row}
        margin={EnumFlexItemMargin.Top}
      >
        <Toggle
          label="Enable Dev Version"
          onChange={handleEnableDevVersion}
          checked={devVersion?.enabled || false}
          disabled={disabled}
        />
      </FlexItem>

      <Snackbar
        open={Boolean(error) || Boolean(updateError)}
        message={errorMessage}
      />
    </Panel>
  );
};

export default PrivatePluginDevVersion;
