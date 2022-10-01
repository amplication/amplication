import { HorizontalRule, Snackbar } from "@amplication/design-system";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import classNames from "classnames";
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
import { setEditorTheme } from "../Resource/code-view/CodeViewEditor";
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

const InstalledPluginSettings: React.FC<Props> = ({
  match,
  moduleClass,
}: Props) => {
  const { resource, plugin: pluginInstallationId } = match.params;
  const { currentProject, currentWorkspace } = useContext(AppContext);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [initialValue, setInitialValue] = useState<any>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const {
    pluginInstallation,
    loadingPluginInstallation,
    pluginCatalog,
    updatePluginInstallation,
    updateError,
  } = usePlugins(resource, pluginInstallationId);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const plugin = useMemo(() => {
    return (
      pluginInstallation &&
      pluginCatalog[pluginInstallation?.PluginInstallation.pluginId]
    );
  }, [pluginInstallation, pluginCatalog]);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
  }

  function handleEditorChange(value: string | undefined) {
    setIsDirty(true);
  }

  function handleEditorValidation(markers: monaco.editor.IMarker[]) {
    setIsValid(markers.length === 0);
  }

  const handleResetClick = useCallback(() => {
    setInitialValue(plugin?.versions[0].settings);
    setIsDirty(true);
  }, [setInitialValue, plugin]);

  const handleSaveClick = useCallback(() => {
    if (!pluginInstallation) return;

    const { enabled, version, id } = pluginInstallation.PluginInstallation;
    const currentValue = editorRef.current?.getValue() || "{}";

    updatePluginInstallation({
      variables: {
        data: {
          enabled,
          version,
          settings: JSON.parse(currentValue),
        },
        where: {
          id: id,
        },
      },
    }).catch(console.error);
  }, [updatePluginInstallation, pluginInstallation]);

  useEffect(() => {
    setInitialValue(pluginInstallation?.PluginInstallation.settings);
    setIsDirty(false);
  }, [pluginInstallation]);

  const errorMessage = formatError(updateError);

  return (
    <div className={moduleClass}>
      <div className={`${moduleClass}__row`}>
        <BackNavigation
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/plugins/installed`}
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
          <div
            className={classNames(`${moduleClass}__editor`, {
              [`${moduleClass}__editor--invalid`]: !isValid,
            })}
          >
            {pluginInstallation && (
              <MonacoEditor
                beforeMount={setEditorTheme}
                onMount={handleEditorDidMount}
                onValidate={handleEditorValidation}
                onChange={handleEditorChange}
                height="100%"
                value={JSON.stringify(initialValue, null, "\t")}
                defaultLanguage="json"
                options={{ readOnly: false, minimap: { enabled: false } }}
                theme={"vs-dark-amp"}
              />
            )}
          </div>
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
              disabled={!isValid || !isDirty}
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
