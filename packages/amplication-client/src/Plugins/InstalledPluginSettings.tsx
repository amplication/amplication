import {
  HorizontalRule,
  CodeEditor,
  Snackbar,
  Label,
  SelectMenu,
  SelectMenuModal,
  SelectMenuList,
  SelectMenuItem,
  FlexItem,
  EnumItemsAlign,
  EnumFlexDirection,
  EnumGapSize,
} from "@amplication/ui/design-system";
import { JsonFormatting, isValidJSON } from "@amplication/util/json";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { match } from "react-router-dom";
import { BackNavigation } from "../Components/BackNavigation";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins from "./hooks/usePlugins";
import { PluginVersion } from "./hooks/usePluginCatalog";
import "./InstalledPluginSettings.scss";
import { PluginLogo } from "./PluginLogo";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    plugin: string;
  }>;
};

export const generatedKey = () => Math.random().toString(36).slice(2, 7);

const InstalledPluginSettings: React.FC<Props> = ({
  match,
  moduleClass,
}: Props) => {
  const { plugin: pluginInstallationId } = match.params;
  const { currentResource } = useContext(AppContext);
  const { baseUrl } = useResourceBaseUrl();

  const editorRef: React.MutableRefObject<string | null> = useRef();
  const [isValid, setIsValid] = useState<boolean>(true);
  const [configurations, setConfiguration] =
    useState<Record<string, unknown>>();

  const {
    pluginInstallation,
    loadingPluginInstallation,
    pluginCatalog,
    loadPrivatePluginsCatalog,
    privatePluginCatalog,
    updatePluginInstallation,
    updateError,
  } = usePlugins(
    currentResource.id,
    pluginInstallationId,
    currentResource?.codeGenerator
  );
  const [selectedVersion, setSelectedVersion] = useState(
    pluginInstallation?.pluginInstallation.version
  );

  useEffect(() => {
    if (pluginInstallation?.pluginInstallation.isPrivate) {
      loadPrivatePluginsCatalog();
    }
  }, [pluginInstallation, loadPrivatePluginsCatalog]);

  const plugin = useMemo(() => {
    if (pluginInstallation?.pluginInstallation.isPrivate) {
      return privatePluginCatalog[
        pluginInstallation?.pluginInstallation.pluginId
      ];
    }

    return (
      pluginInstallation &&
      pluginCatalog[pluginInstallation?.pluginInstallation.pluginId]
    );
  }, [pluginInstallation, pluginCatalog, privatePluginCatalog]);

  const enabledPluginVersions = useMemo(() => {
    if (!plugin) return;
    return pluginInstallation.pluginInstallation.isPrivate
      ? plugin.versions.filter((version) => version.enabled)
      : plugin.versions;
  }, [plugin, pluginInstallation]);

  const [editorValue, setEditorValue] = useState<string>(
    JsonFormatting(pluginInstallation?.pluginInstallation.settings)
  );

  useEffect(() => {
    if (!plugin || !pluginInstallation) return;

    const pluginInstalledVersion = plugin.versions.find(
      (pluginVersion: PluginVersion) =>
        pluginVersion.version === pluginInstallation?.pluginInstallation.version
    );
    const mergedSettings = JSON.stringify({
      ...(pluginInstalledVersion.settings as unknown as { [key: string]: any }),
      ...pluginInstallation?.pluginInstallation.settings,
    });
    if (JSON.stringify(pluginInstalledVersion.settings))
      editorRef.current = mergedSettings;
    setEditorValue(JsonFormatting(mergedSettings));
  }, [plugin, pluginInstallation]);

  useEffect(() => {
    setConfiguration(pluginInstallation?.pluginInstallation.configurations);
  }, [pluginInstallation?.pluginInstallation.configurations]);

  useEffect(() => {
    if (pluginInstallation && !selectedVersion) {
      setSelectedVersion(pluginInstallation.pluginInstallation.version);
    }
  }, [pluginInstallation, selectedVersion]);

  const onEditorChange = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) => {
    const validateChange = isValidJSON(value);
    if (validateChange) {
      setEditorValue(JsonFormatting(value));
    }
    editorRef.current = validateChange ? value : undefined;
    setIsValid(!validateChange);
  };

  const handleResetClick = useCallback(() => {
    setEditorValue(
      JsonFormatting(pluginInstallation?.pluginInstallation.settings)
    );
  }, [pluginInstallation?.pluginInstallation.settings]);

  const handleSelectVersion = useCallback(
    (pluginVersion: PluginVersion) => {
      setSelectedVersion(pluginVersion.version);
      pluginInstallation?.pluginInstallation.version !==
        pluginVersion.version && setIsValid(false);

      const mergedSettings = JSON.stringify({
        ...(pluginVersion.settings as unknown as { [key: string]: any }),
        ...(pluginInstallation?.pluginInstallation.settings ?? {}),
      });
      editorRef.current = mergedSettings;
      setEditorValue(JsonFormatting(mergedSettings));
      setConfiguration(pluginVersion.configurations);
    },
    [pluginInstallation]
  );

  const handlePluginInstalledSave = useCallback(() => {
    if (!pluginInstallation) return;
    const { enabled, id } = pluginInstallation.pluginInstallation;

    updatePluginInstallation({
      variables: {
        data: {
          enabled,
          version: selectedVersion,
          settings: JSON.parse(editorRef.current) || JSON.parse("{}"),
          configurations: configurations || JSON.parse("{}"),
        },
        where: {
          id: id,
        },
      },
    }).catch(console.error);
  }, [
    pluginInstallation,
    updatePluginInstallation,
    selectedVersion,
    configurations,
  ]);

  const errorMessage = formatError(updateError);

  return (
    <div className={moduleClass}>
      <div className={`${moduleClass}__row`}>
        <BackNavigation
          to={`${baseUrl}/plugins/installed`}
          label="Back to Plugins"
        />
      </div>
      {loadingPluginInstallation || !plugin ? (
        <div>loading</div>
      ) : (
        <>
          <div className={`${moduleClass}__row`}>
            <PluginLogo plugin={plugin} />
            <div className={`${moduleClass}__name`}>{plugin.name}</div>
          </div>
          <div className={`${moduleClass}__column`}>
            <span className={`${moduleClass}__description`}>
              {plugin.description}
            </span>
            <div className={`${moduleClass}__row`}>
              <div className={`${moduleClass}__label-title`}>
                <Label text="Plugin Version" />
              </div>
              <SelectMenu
                title={
                  selectedVersion ||
                  pluginInstallation.pluginInstallation.version
                }
                buttonStyle={EnumButtonStyle.Outline}
                className={`${moduleClass}__menu`}
                icon="chevron_down"
              >
                <SelectMenuModal>
                  <SelectMenuList>
                    <>
                      {enabledPluginVersions.map(
                        (pluginVersion: PluginVersion) => (
                          <SelectMenuItem
                            closeAfterSelectionChange
                            itemData={pluginVersion}
                            selected={pluginVersion.version === selectedVersion}
                            key={pluginVersion.version}
                            onSelectionChange={(pluginVersion) => {
                              handleSelectVersion(pluginVersion);
                            }}
                          >
                            <FlexItem
                              direction={EnumFlexDirection.Row}
                              itemsAlign={EnumItemsAlign.Center}
                              gap={EnumGapSize.Small}
                            >
                              <span>{pluginVersion.version} </span>
                              <span>
                                {pluginVersion.deprecated ? "(deprecated)" : ""}
                              </span>
                            </FlexItem>
                          </SelectMenuItem>
                        )
                      )}
                    </>
                  </SelectMenuList>
                </SelectMenuModal>
              </SelectMenu>
            </div>
          </div>
          <HorizontalRule />
          <CodeEditor
            defaultValue={editorValue}
            value={editorValue}
            onChange={onEditorChange}
            defaultLanguage={"json"}
          />
          <div className={`${moduleClass}__row`}>
            <Button
              className={`${moduleClass}__reset`}
              buttonStyle={EnumButtonStyle.Outline}
              onClick={handleResetClick}
            >
              Undo Changes
            </Button>
            <Button
              className={`${moduleClass}__save`}
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handlePluginInstalledSave}
              disabled={isValid}
            >
              Save
            </Button>
          </div>
        </>
      )}
      <Snackbar open={Boolean(updateError)} message={errorMessage} />
    </div>
  );
};

export default InstalledPluginSettings;
