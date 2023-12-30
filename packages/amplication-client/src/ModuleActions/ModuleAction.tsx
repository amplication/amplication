import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { DeleteModuleAction } from "./DeleteModuleAction";
import ModuleActionForm from "./ModuleActionForm";
import useModuleAction from "./hooks/useModuleAction";

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
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);

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
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator, refetch]);

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
    [updateModuleAction, moduleActionId, addEntity]
  );

  const hasError = Boolean(error) || Boolean(updateModuleActionError);

  const errorMessage =
    formatError(error) || formatError(updateModuleActionError);

  const isCustomAction =
    data?.ModuleAction?.actionType === models.EnumModuleActionType.Custom;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.ModuleAction?.displayName}
          subTitle={data?.ModuleAction?.description}
        />
        <FlexItem.FlexEnd>
          {data?.ModuleAction && isCustomAction && (
            <DeleteModuleAction moduleAction={data?.ModuleAction} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.ModuleAction && !isCustomAction && (
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
          defaultValues={data?.ModuleAction}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleAction;
