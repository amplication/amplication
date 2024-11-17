import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Toggle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { formatError } from "../util/error";
import useBlueprints from "./hooks/useBlueprints";
import BlueprintForm from "./BlueprintForm";
import { DeleteBlueprint } from "./DeleteBlueprint";
import { useAppContext } from "../context/appContext";
import BlueprintRelationList from "./BlueprintRelationList";

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
          <BlueprintRelationList blueprint={data?.blueprint} />
        </>
      )}

      <FlexItem margin={EnumFlexItemMargin.Both} />
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Blueprint;
