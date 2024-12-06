import { Snackbar } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import CustomPropertiesFormField from "../CustomProperties/CustomPropertiesFormField";
import useBlueprintCustomPropertiesMap from "../CustomProperties/hooks/useBlueprintCustomPropertiesMap";
import * as models from "../models";
import { formatError } from "../util/error";
import { UPDATE_RESOURCE_SETTINGS } from "../Workspaces/queries/resourcesQueries";

type Props = {
  resource: models.Resource;
};

type TData = {
  updateResource: models.Resource;
};

const CLASS_NAME = "resource-form";

function ResourceSettingsForm({ resource }: Props) {
  const { customPropertiesMap } = useBlueprintCustomPropertiesMap(
    resource?.blueprintId
  );

  const [updateResourceSettings, { error: updateError }] = useMutation<TData>(
    UPDATE_RESOURCE_SETTINGS
  );

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

  const errorMessage = formatError(updateError);
  return (
    <div className={CLASS_NAME}>
      {resource && (
        <Formik
          initialValues={resource.settings || { properties: {} }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => {
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
                </Form>
              </>
            );
          }}
        </Formik>
      )}
      <Snackbar open={Boolean(updateError?.message)} message={errorMessage} />
    </div>
  );
}

export default ResourceSettingsForm;
