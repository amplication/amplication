import {
  Button,
  EnumButtonStyle,
  FlexItem,
  Snackbar,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import CustomPropertiesFormField from "../CustomProperties/CustomPropertiesFormField";
import useBlueprintCustomPropertiesMap from "../CustomProperties/hooks/useBlueprintCustomPropertiesMap";
import * as models from "../models";
import { formatError } from "../util/error";
import useResourceSettings from "./hooks/useResourceSettings";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-form";

function ResourceSettingsForm({ resource }: Props) {
  const { customPropertiesMap } = useBlueprintCustomPropertiesMap(
    resource?.blueprintId
  );

  const {
    resourceSettings,
    updateResourceSettings,
    updateError: error,
    loading,
  } = useResourceSettings(resource?.id);

  const handleSubmit = useCallback(
    (data: models.ResourceSettings) => {
      const { properties } = data;

      updateResourceSettings({
        variables: {
          data: {
            properties,
          },
          resourceId: resource.id,
        },
      }).catch(console.error);
    },
    [updateResourceSettings, resource]
  );

  const errorMessage = formatError(error);
  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={resourceSettings || { properties: {} }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <>
              <Form>
                {Object.values(customPropertiesMap).map((customProperty) => (
                  <>
                    <CustomPropertiesFormField
                      key={customProperty.key}
                      property={customProperty}
                    />
                  </>
                ))}
                <div>
                  <FlexItem
                    end={
                      <Button
                        type="submit"
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={!formik.isValid || !formik.dirty || loading}
                      >
                        Save
                      </Button>
                    }
                  ></FlexItem>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error?.message)} message={errorMessage} />
    </div>
  );
}

export default ResourceSettingsForm;
