import {
  FlexItem,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { formatError } from "../util/error";
import useCustomProperties from "./hooks/useCustomProperties";
import CustomPropertyForm from "./CustomPropertyForm";
import { DeleteCustomProperty } from "./DeleteCustomProperty";
import { useAppContext } from "../context/appContext";
import { EnumCustomPropertyType } from "../models";

const CustomProperty = () => {
  const match = useRouteMatch<{
    customPropertyId: string;
  }>(["/:workspace/properties/:customPropertyId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}`;
  const history = useHistory();

  const { customPropertyId } = match?.params ?? {};

  const {
    getCustomPropertyData: data,
    getCustomPropertyError: error,
    getCustomPropertyLoading: loading,
    updateCustomProperty,
    updateCustomPropertyError: updateError,
  } = useCustomProperties(customPropertyId);

  const handleSubmit = useCallback(
    (data) => {
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
    history.push(`${baseUrl}/customProperties`);
  }, [history, baseUrl]);

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.customProperty?.name}
          subTitle={data?.customProperty?.description}
        />
        <FlexItem.FlexEnd>
          {data?.customProperty && (
            <DeleteCustomProperty
              customProperty={data?.customProperty}
              onDelete={handleDeleteModule}
            />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && (
        <CustomPropertyForm
          onSubmit={handleSubmit}
          defaultValues={data?.customProperty}
        />
      )}
      {[
        EnumCustomPropertyType.Select,
        EnumCustomPropertyType.MultiSelect,
      ].includes(data?.customProperty.type) && (
        <>
          <TabContentTitle title="Options" subTitle="Add or remove options" />
          <Snackbar open={hasError} message={errorMessage} />
        </>
      )}
    </>
  );
};

export default CustomProperty;
