import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { DeleteModule } from "./DeleteModule";
import "./Module.scss";
import ModuleForm from "./ModuleForm";
import useModule from "./hooks/useModule";

const CLASS_NAME = "module";

const Module = () => {
  const match = useRouteMatch<{
    resource: string;
    moduleId: string;
  }>("/:workspace/:project/:resource/modules/:moduleId");

  const { moduleId } = match?.params ?? {};
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);
  const history = useHistory();

  const {
    getModule,
    getModuleData: data,
    getModuleError: error,
    getModuleLoading: loading,
    getModuleRefetch: refetch,
    updateModule,
    updateModuleError,
  } = useModule();

  useEffect(() => {
    getModule({
      variables: {
        moduleId,
      },
    });
  }, [moduleId, getModule]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator]);

  const handleSubmit = useCallback(
    (data) => {
      updateModule({
        onCompleted: () => {
          addEntity(moduleId);
        },
        variables: {
          where: {
            id: moduleId,
          },
          data: {
            ...data,
            displayName: data.name,
          },
        },
      }).catch(console.error);
    },
    [updateModule, moduleId]
  );

  const hasError = Boolean(error) || Boolean(updateModuleError);

  const errorMessage = formatError(error) || formatError(updateModuleError);

  const handleDeleteModule = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules`
    );
  }, [history, currentWorkspace?.id, currentProject?.id, currentResource?.id]);

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Module Settings</h3>
        {data?.Module && (
          <DeleteModule module={data?.Module} onDelete={handleDeleteModule} />
        )}
      </div>

      <HorizontalRule />
      {!loading && (
        <ModuleForm onSubmit={handleSubmit} defaultValues={data?.Module} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Module;
