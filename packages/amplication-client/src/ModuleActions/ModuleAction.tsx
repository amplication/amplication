import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { DeleteModuleAction } from "./DeleteModuleAction";
import ModuleActionForm from "./ModuleActionForm";
import useModuleAction from "./hooks/useModuleAction";
import * as models from "../models";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    module: string;
    moduleAction: string;
  }>;
};

const ModuleAction = ({ match }: Props) => {
  const { moduleAction: moduleActionId } = match?.params ?? {};

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
    getModuleAction,
    getModuleActionData: data,
    getModuleActionError: error,
    getModuleActionLoading: loading,
    getModuleActionRefetch: refetch,
    updateModuleAction,
    updateModuleActionError,
  } = useModuleAction();

  useEffect(() => {
    if (!moduleActionId) return;
    getModuleAction({
      variables: {
        moduleActionId,
      },
    }).catch(console.error);
  }, [moduleActionId, getModuleAction]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator]);

  const handleSubmit = useCallback(
    (data) => {
      updateModuleAction({
        onCompleted: () => {
          addEntity(moduleActionId);
        },
        variables: {
          where: {
            id: moduleActionId,
          },
          data: {
            ...data,
          },
        },
      }).catch(console.error);
    },
    [updateModuleAction, moduleActionId]
  );

  const hasError = Boolean(error) || Boolean(updateModuleActionError);

  const errorMessage =
    formatError(error) || formatError(updateModuleActionError);

  const isCustomAction =
    data?.moduleAction?.actionType === models.EnumModuleActionType.Custom;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.moduleAction?.displayName}
          subTitle={data?.moduleAction?.description}
        />
        <FlexItem.FlexEnd>
          {data?.moduleAction && isCustomAction && (
            <DeleteModuleAction moduleAction={data?.moduleAction} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.moduleAction && !isCustomAction && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Description}>
            This is a default action that was created automatically with the
            entity. It cannot be deleted, and its name cannot be changed.
          </Text>
        </FlexItem>
      )}

      {!loading && (
        <ModuleActionForm
          isCustomAction={isCustomAction}
          onSubmit={handleSubmit}
          defaultValues={data?.moduleAction}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleAction;
