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

import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import CustomPropertyFormAndOptions from "./CustomPropertyFormAndOptions";
import { DeleteCustomProperty } from "./DeleteCustomProperty";
import useCustomProperties from "./hooks/useCustomProperties";

const CustomProperty = () => {
  const match = useRouteMatch<{
    customPropertyId: string;
  }>(["/:workspace/settings/properties/:customPropertyId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}/settings`;
  const history = useHistory();

  const { customPropertyId } = match?.params ?? {};

  const {
    getCustomPropertyData: data,
    getCustomPropertyError: error,
    getCustomPropertyLoading: loading,
    updateCustomProperty,
    updateCustomPropertyError: updateError,
    getCustomPropertyRefetch: refetch,
  } = useCustomProperties(customPropertyId);

  const handleSubmit = useCallback(
    (data: Partial<models.CustomProperty>) => {
      updateCustomProperty({
        variables: {
          where: {
            id: customPropertyId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateCustomProperty, customPropertyId]
  );

  const handleDeleteModule = useCallback(() => {
    history.push(`${baseUrl}/properties`);
  }, [history, baseUrl]);

  const onEnableChanged = useCallback(() => {
    if (!data?.customProperty) return;
    handleSubmit({
      enabled: !data.customProperty.enabled,
    });
  }, [data?.customProperty, handleSubmit]);

  const onOptionListChanged = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.customProperty?.name}
          subTitle={data?.customProperty?.description}
        />
        <FlexItem.FlexEnd
          direction={EnumFlexDirection.Row}
          alignSelf={EnumContentAlign.Start}
        >
          {data?.customProperty && (
            <>
              <Toggle
                name={"enabled"}
                onValueChange={onEnableChanged}
                checked={data?.customProperty?.enabled}
              ></Toggle>
              <DeleteCustomProperty
                customProperty={data?.customProperty}
                showLabel={true}
                onDelete={handleDeleteModule}
              />
            </>
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && data?.customProperty && (
        <CustomPropertyFormAndOptions
          handleSubmit={handleSubmit}
          customProperty={data?.customProperty}
          onOptionListChanged={onOptionListChanged}
        ></CustomPropertyFormAndOptions>
      )}

      <FlexItem margin={EnumFlexItemMargin.Both} />
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default CustomProperty;
