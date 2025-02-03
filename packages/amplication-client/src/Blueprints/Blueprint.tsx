import {
  Button,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  Toggle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { useAppContext } from "../context/appContext";
import { formatError } from "../util/error";
import BlueprintAdvancedSettingsForm from "./BlueprintAdvancedSettingsForm";
import BlueprintForm from "./BlueprintForm";
import BlueprintPropertyList from "./BlueprintPropertyList";
import BlueprintRelationList from "./BlueprintRelationList";
import { DeleteBlueprint } from "./DeleteBlueprint";
import useBlueprints from "./hooks/useBlueprints";
import * as models from "../models";

const Blueprint = () => {
  const match = useRouteMatch<{
    blueprintId: string;
  }>(["/:workspace/blueprints/:blueprintId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}`;
  const history = useHistory();

  const { blueprintId } = match?.params ?? {};

  const {
    getBlueprintData: data,
    getBlueprintError: error,
    getBlueprintLoading: loading,
    updateBlueprint,
    updateBlueprintError: updateError,
    updateBlueprintEngine,
    updateBlueprintEngineError: updateEngineError,
    getBlueprintRefetch: refetch,
  } = useBlueprints(blueprintId);

  const handleSubmit = useCallback(
    (data) => {
      updateBlueprint({
        variables: {
          where: {
            id: blueprintId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateBlueprint, blueprintId]
  );

  const handleSubmitEngine = useCallback(
    (data: models.Blueprint) => {
      updateBlueprintEngine({
        variables: {
          where: {
            id: blueprintId,
          },
          data: {
            resourceType: data.resourceType,
            codeGenerator:
              data.resourceType === models.EnumResourceType.Service
                ? data.codeGenerator
                : undefined,
          },
        },
      }).catch(console.error);
    },
    [updateBlueprintEngine, blueprintId]
  );

  const handleDeleteModule = useCallback(() => {
    history.push(`${baseUrl}/blueprints`);
  }, [history, baseUrl]);

  const onEnableChanged = useCallback(() => {
    if (!data?.blueprint) return;
    handleSubmit({
      enabled: !data.blueprint.enabled,
    });
  }, [data?.blueprint, handleSubmit]);

  const handlePropertyAdded = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasError =
    Boolean(error) || Boolean(updateError) || Boolean(updateEngineError);
  const errorMessage =
    formatError(error) ||
    formatError(updateError) ||
    formatError(updateEngineError);

  const handleViewResources = useCallback(() => {
    history.push(`${baseUrl}`, {
      filters: {
        blueprintId: [blueprintId],
      },
    });
  }, [history, baseUrl, blueprintId]);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.blueprint?.name}
          subTitle={data?.blueprint?.description}
        />
        <FlexItem.FlexEnd
          direction={EnumFlexDirection.Row}
          alignSelf={EnumContentAlign.Start}
        >
          {data?.blueprint && (
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <Toggle
                title="Enabled"
                name={"enabled"}
                onValueChange={onEnableChanged}
                checked={data?.blueprint?.enabled}
              ></Toggle>
              <Button
                icon="search"
                buttonStyle={EnumButtonStyle.Text}
                onClick={handleViewResources}
              >
                View Resources
              </Button>
              <DeleteBlueprint
                blueprint={data?.blueprint}
                onDelete={handleDeleteModule}
              />
            </FlexItem>
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && data?.blueprint && (
        <>
          <BlueprintForm
            onSubmit={handleSubmit}
            defaultValues={data.blueprint}
          />
          <HorizontalRule doubleSpacing />
          <BlueprintPropertyList
            blueprint={data.blueprint}
            onPropertyUpdated={handlePropertyAdded}
          />
          <HorizontalRule doubleSpacing />
          <BlueprintRelationList blueprint={data.blueprint} />
          <HorizontalRule doubleSpacing />
          <BlueprintAdvancedSettingsForm
            onSubmit={handleSubmitEngine}
            blueprint={data.blueprint}
          />
        </>
      )}

      <FlexItem margin={EnumFlexItemMargin.Both} />
      <FlexItem margin={EnumFlexItemMargin.Both} />
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Blueprint;
