import {
  HorizontalRule,
  CodeEditor,
  Snackbar,
  Label,
  SelectMenu,
  SelectMenuModal,
  SelectMenuList,
  SelectMenuItem,
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
import usePlugins, { PluginVersion } from "./hooks/usePlugins";
import "./InstalledPluginSettings.scss";
import { PluginLogo } from "./PluginLogo";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    plugin: string;
  }>;
};

const generatedKey = () => Math.random().toString(36).slice(2, 7);

const InstalledPluginSettings: React.FC<Props> = ({
  match,
  moduleClass,
}: Props) => {
  const { plugin: pluginInstallationId } = match.params;
  const { currentProject, currentWorkspace, currentResource } =
    useContext(AppContext);
  const editorRef: React.MutableRefObject<string | null> = useRef();
  const [isValid, setIsValid] = useState<boolean>(true);
  const [configurations, setConfiguration] = useState<string>();

  const [resetKey, setResetKey] = useState<string>();

  const {
    pluginInstallation,
    loadingPluginInstallation,
    pluginCatalog,
    updatePluginInstallation,
    updateError,
  } = usePlugins(currentResource.id, pluginInstallationId);
  const [selectedVersion, setSelectedVersion] = useState(
    pluginInstallation?.PluginInstallation.version
  );
  const [value, setEditorValue] = useState<string>(
    JsonFormatting(pluginInstallation?.PluginInstallation.settings)
  );

  useEffect(() => {
    editorRef.current = JSON.stringify(
      pluginInstallation?.PluginInstallation.settings
    );
  }, [pluginInstallation?.PluginInstallation.settings]);

  useEffect(() => {
    setConfiguration(pluginInstallation?.PluginInstallation.configurations);
  }, [pluginInstallation?.PluginInstallation.configurations]);

  useEffect(() => {
    if (pluginInstallation && !selectedVersion) {
      setSelectedVersion(pluginInstallation.PluginInstallation.version);
    }
  }, [pluginInstallation?.PluginInstallation.version]);

  const plugin = useMemo(() => {
    return (
      pluginInstallation &&
      pluginCatalog[pluginInstallation?.PluginInstallation.pluginId]
    );
  }, [pluginInstallation, pluginCatalog]);

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
    setResetKey(generatedKey());
  }, []);

  const handleSelectVersion = useCallback(
    (pluginVersion: PluginVersion) => {
      setSelectedVersion(pluginVersion.version);
      pluginInstallation?.PluginInstallation.version !==
        pluginVersion.version && setIsValid(false);
      editorRef.current = JSON.stringify(pluginVersion.settings);
      setConfiguration(pluginVersion.configurations);
    },
    [setSelectedVersion, setIsValid, setConfiguration]
  );

  const handlePluginInstalledSave = useCallback(() => {
    if (!pluginInstallation) return;
    const { enabled, id } = pluginInstallation.PluginInstallation;

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
  }, [updatePluginInstallation, pluginInstallation, selectedVersion]);

  const errorMessage = formatError(updateError);

  return (
    <div className={moduleClass}>
      <div className={`${moduleClass}__row`}>
        <BackNavigation
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource.id}/plugins/installed`}
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
                  pluginInstallation.PluginInstallation.version
                }
                buttonStyle={EnumButtonStyle.Secondary}
                className={`${moduleClass}__menu`}
                icon="chevron_down"
              >
                <SelectMenuModal>
                  <SelectMenuList>
                    <>
                      {plugin.versions.map((pluginVersion: PluginVersion) => (
                        <SelectMenuItem
                          closeAfterSelectionChange
                          itemData={pluginVersion}
                          selected={pluginVersion.version === selectedVersion}
                          key={pluginVersion.id}
                          onSelectionChange={(pluginVersion) => {
                            handleSelectVersion(pluginVersion);
                          }}
                        >
                          {pluginVersion.version}
                        </SelectMenuItem>
                      ))}
                    </>
                  </SelectMenuList>
                </SelectMenuModal>
              </SelectMenu>
            </div>
          </div>
          <HorizontalRule />
          <CodeEditor
            defaultValue={pluginInstallation?.PluginInstallation.settings}
            value={value}
            resetKey={resetKey}
            onChange={onEditorChange}
            defaultLanguage={"json"}
          />
          <div className={`${moduleClass}__row`}>
            <Button
              className={`${moduleClass}__reset`}
              buttonStyle={EnumButtonStyle.Secondary}
              onClick={handleResetClick}
            >
              Reset to default
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
