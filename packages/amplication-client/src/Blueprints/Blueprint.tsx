import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
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
import BlueprintForm from "./BlueprintForm";
import BlueprintPropertyList from "./BlueprintPropertyList";
import BlueprintRelationList from "./BlueprintRelationList";
import { DeleteBlueprint } from "./DeleteBlueprint";
import useBlueprints from "./hooks/useBlueprints";

const Blueprint = () => {
  const match = useRouteMatch<{
    blueprintId: string;
  }>(["/:workspace/settings/blueprints/:blueprintId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}/settings`;
  const history = useHistory();

  const { blueprintId } = match?.params ?? {};

  const {
    getBlueprintData: data,
    getBlueprintError: error,
    getBlueprintLoading: loading,
    updateBlueprint,
    updateBlueprintError: updateError,
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

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

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
            <>
              <Toggle
                name={"enabled"}
                onValueChange={onEnableChanged}
                checked={data?.blueprint?.enabled}
              ></Toggle>
              <DeleteBlueprint
                blueprint={data?.blueprint}
                onDelete={handleDeleteModule}
              />
            </>
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && (
        <>
          <BlueprintForm
            onSubmit={handleSubmit}
            defaultValues={data?.blueprint}
          />
          <HorizontalRule doubleSpacing />
          <BlueprintPropertyList
            blueprint={data?.blueprint}
            onPropertyUpdated={handlePropertyAdded}
          />
          <HorizontalRule doubleSpacing />
          <BlueprintRelationList blueprint={data?.blueprint} />
        </>
      )}

      <FlexItem margin={EnumFlexItemMargin.Both} />
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Blueprint;
