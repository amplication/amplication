import {
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  TextField,
} from "@amplication/ui/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { OwnerSelector } from "../Components/OwnerSelector";
import { useAppContext } from "../context/appContext";
import CustomPropertiesFormFields from "../CustomProperties/CustomPropertiesFormFields";
import getPropertiesValidationSchemaUtil from "../CustomProperties/getPropertiesValidationSchemaUtil";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import {
  GET_RESOURCE,
  UPDATE_RESOURCE,
} from "../Workspaces/queries/resourcesQueries";

type Props = {
  resourceId: string;
  disabled: boolean;
};

type TData = {
  updateResource: models.Resource;
};

const { AT_LEAST_TWO_CHARACTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
    description: {
      type: "string",
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARACTERS,
    },
  },
};

const CLASS_NAME = "resource-form";

function ResourceForm({ resourceId, disabled }: Props) {
  const { data, error } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
  });

  const { customPropertiesMap } = useAppContext();

  const { trackEvent } = useTracking();

  const [updateResource, { error: updateError }] =
    useMutation<TData>(UPDATE_RESOURCE);

  const handleSubmit = useCallback(
    (data: models.Resource) => {
      const { name, description, properties } = data;
      trackEvent({
        eventName: AnalyticsEventNames.ResourceInfoUpdate,
      });
      updateResource({
        variables: {
          data: {
            name,
            description,
            properties,
          },
          resourceId: resourceId,
        },
      }).catch(console.error);
    },
    [updateResource, resourceId, trackEvent]
  );

  const propertiesSchema = useMemo(() => {
    return getPropertiesValidationSchemaUtil(
      Object.values(customPropertiesMap)
    );
  }, [customPropertiesMap]);

  const validationSchema = {
    ...FORM_SCHEMA,
    properties: {
      ...FORM_SCHEMA.properties,
      properties: propertiesSchema.schema,
    },
  };

  const initialValue = useMemo(() => {
    //in case properties were disabled - we need to remove them from the form to avoid validation errors
    const properties = Object.keys(data?.resource.properties || {}).reduce(
      (acc, key) => {
        if (propertiesSchema.schema.properties?.[key]) {
          acc[key] = data?.resource.properties[key];
        }
        return acc;
      },
      {}
    );

    //add missing required properties
    Object.values(customPropertiesMap).forEach((property) => {
      if (!properties[property.key]) {
        if (property.required) {
          properties[property.key] = null;
        }
      }
    }, {});

    return {
      ...data?.resource,
      properties,
    };
  }, [data?.resource, propertiesSchema, customPropertiesMap]);

  const errorMessage = formatError(error || updateError);
  return (
    <div className={CLASS_NAME}>
      {data?.resource && (
        <Formik
          initialValues={initialValue}
          validate={(values: models.Resource) =>
            validate(values, validationSchema)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => {
            return (
              <>
                <Form>
                  <TabContentTitle
                    title={`${
                      data.resource.resourceType ===
                      models.EnumResourceType.ProjectConfiguration
                        ? "Project"
                        : "Resource"
                    } Settings`}
                  />

                  {!disabled && <FormikAutoSave debounceMS={1000} />}
                  <TextField name="name" label="Name" disabled={disabled} />
                  <TextField
                    disabled={disabled}
                    autoComplete="off"
                    textarea
                    rows={3}
                    name="description"
                    label="Description"
                  />
                </Form>
                <OwnerSelector resource={data.resource} disabled={disabled} />
                <HorizontalRule doubleSpacing />

                <TabContentTitle title={`Catalog Properties`} />
                <CustomPropertiesFormFields disabled={disabled} />
              </>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(error?.message || updateError?.message)}
        message={errorMessage}
      />
    </div>
  );
}

export default ResourceForm;
