import {
  HorizontalRule,
  CodeEditor,
  Snackbar,
} from "@amplication/design-system";
import { isValidJSON } from "@amplication/design-system/components/CodeEditor/CodeEditor";
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
  const [isValid, setIsValid] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<string>();

  const {
    pluginInstallation,
    loadingPluginInstallation,
    pluginCatalog,
    updatePluginInstallation,
    updateError,
  } = usePlugins(currentResource.id, pluginInstallationId);

  useEffect(() => {
    editorRef.current = JSON.stringify(
      pluginInstallation?.PluginInstallation.settings
    );
  }, [pluginInstallation?.PluginInstallation.settings]);

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
    editorRef.current = validateChange ? value : undefined;
    setIsValid(!validateChange);
  };

  const handleResetClick = useCallback(() => {
    setResetKey(generatedKey());
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!pluginInstallation) return;

    const { enabled, version, id } = pluginInstallation.PluginInstallation;

    updatePluginInstallation({
      variables: {
        data: {
          enabled,
          version,
          settings: JSON.parse(editorRef.current),
        },
        where: {
          id: id,
        },
      },
    }).catch(console.error);
  }, [updatePluginInstallation, pluginInstallation]);

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
          <div className={`${moduleClass}__row`}>
            <span className={`${moduleClass}__description`}>
              {plugin.description}
            </span>
          </div>
          <HorizontalRule />
          <CodeEditor
            defaultValue={pluginInstallation?.PluginInstallation.settings}
            resetKey={resetKey}
            onChange={onEditorChange}
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
              onClick={handleSaveClick}
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
