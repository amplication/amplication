import {
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { DeleteModule } from "./DeleteModule";
import "./Module.scss";
import ModuleForm from "./ModuleForm";
import useModule from "./hooks/useModule";

const Module = () => {
  const match = useRouteMatch<{
    resource: string;
    module: string;
  }>("/:workspace/:project/:resource/modules/:module");

  const { module: moduleId } = match?.params ?? {};
  const {
    currentWorkspace,
    currentProject,
    currentResource,
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
    if (!moduleId) return;
    getModule({
      variables: {
        moduleId,
      },
    }).catch(console.error);
  }, [moduleId, getModule]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator]);

  const handleSubmit = useCallback(
    (data) => {
      updateModule({
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

  const isEntityModule =
    data?.Module && !isEmpty(data.Module.entityId) ? true : false;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.Module?.displayName}
          subTitle={data?.Module?.description}
        />
        <FlexItem.FlexEnd>
          {data?.Module && !isEntityModule && (
            <DeleteModule module={data?.Module} onDelete={handleDeleteModule} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.Module && isEntityModule && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Description}>
            This modules was created automatically with the{" "}
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities/${data?.Module.entityId}`}
            >
              <Text
                textStyle={EnumTextStyle.Description}
                textColor={EnumTextColor.White}
              >
                {data.Module.name} entity
              </Text>
            </Link>
          </Text>
        </FlexItem>
      )}

      {!loading && (
        <ModuleForm
          disabled={isEntityModule}
          onSubmit={handleSubmit}
          defaultValues={data?.Module}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Module;
