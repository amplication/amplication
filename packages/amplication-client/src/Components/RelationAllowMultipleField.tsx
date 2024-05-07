import React, { useCallback } from "react";
import { useFormikContext } from "formik";
import { RadioButtonField } from "@amplication/ui/design-system";

type Props = {
  fieldName: string;
  isDisabled?: boolean;
  entityDisplayName: string;
};

const RelationAllowMultiple = ({ fieldName, entityDisplayName }: Props) => {
  const formik = useFormikContext<{
    id: string;
    displayName: string;
    properties: {
      relatedEntityId: string;
      relatedFieldId: string;
      allowMultipleSelection: boolean;
    };
  }>();

  const handleChange = useCallback(
    (event) => {
      const selectedValue = event.currentTarget.value === "true";
      formik.setFieldValue(fieldName, selectedValue, false);
    },
    [formik, fieldName]
  );

  return (
    <>
      <RadioButtonField
        name="relationAllowMultiple-field"
        value="true"
        checked={formik.values.properties.allowMultipleSelection == true}
        label={`One '${entityDisplayName}' can be related to many '${formik.values.displayName}'`}
        onChange={handleChange}
      />
      <RadioButtonField
        name="relationAllowMultiple-field"
        value="false"
        checked={!formik.values.properties.allowMultipleSelection}
        label={`One '${entityDisplayName}' can be related to one '${formik.values.displayName}'`}
        onChange={handleChange}
      />
    </>
  );
};

export default RelationAllowMultiple;
