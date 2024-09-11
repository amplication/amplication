import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
  Toggle,
  Panel,
  EnumPanelStyle,
  EnumTextColor,
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
import { useModulesContext } from "../Modules/modulesContext";

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

  const { customActionsLicenseEnabled } = useModulesContext();
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
        variables: {
          where: {
            id: moduleActionId,
          },
          data: {
            ...data,
          },
        },
        onCompleted: () => {
          addEntity(moduleActionId);
        },
      }).catch(console.error);
    },
    [updateModuleAction, moduleActionId, addEntity]
  );

  const onEnableChanged = useCallback(
    (value: boolean) => {
      handleSubmit({
        enabled: value,
      });
    },
    [handleSubmit]
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
        <FlexItem.FlexEnd
          direction={EnumFlexDirection.Row}
          alignSelf={EnumContentAlign.Start}
        >
          <Toggle
            name={"enabled"}
            onValueChange={onEnableChanged}
            checked={
              data?.moduleAction?.enabled ? data?.moduleAction?.enabled : false
            }
            disabled={!customActionsLicenseEnabled}
          ></Toggle>
          {data?.moduleAction && isCustomAction && (
            <DeleteModuleAction moduleAction={data?.moduleAction} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.moduleAction && !isCustomAction && (
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.ThemeOrange}
          >
            This is a default action that was created automatically with the
            entity. It cannot be deleted, and its settings cannot be changed.
          </Text>
        </Panel>
      )}

      {!loading && (
        <ModuleActionForm
          isCustomAction={isCustomAction}
          onSubmit={handleSubmit}
          defaultValues={data?.moduleAction}
          disabled={!customActionsLicenseEnabled}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleAction;
