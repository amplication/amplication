import {
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  TextField,
} from "@amplication/ui/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { OwnerSelector } from "../Components/OwnerSelector";
import CustomPropertiesFormFields from "../CustomProperties/CustomPropertiesFormFields";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import { GET_PROJECTS } from "../Workspaces/queries/projectQueries";
import {
  GET_RESOURCE,
  UPDATE_RESOURCE,
} from "../Workspaces/queries/resourcesQueries";

type Props = {
  resourceId: string;
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

function ResourceForm({ resourceId }: Props) {
  const { data, error } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
  });

  const { trackEvent } = useTracking();

  const [updateResource, { error: updateError }] = useMutation<TData>(
    UPDATE_RESOURCE,
    {
      refetchQueries: [
        {
          query: GET_PROJECTS,
        },
      ],
    }
  );

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

  const errorMessage = formatError(error || updateError);
  return (
    <div className={CLASS_NAME}>
      {data?.resource && (
        <Formik
          initialValues={data.resource}
          validate={(values: models.Resource) => validate(values, FORM_SCHEMA)}
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

                  <FormikAutoSave debounceMS={1000} />
                  <TextField name="name" label="Name" />
                  <TextField
                    autoComplete="off"
                    textarea
                    rows={3}
                    name="description"
                    label="Description"
                  />
                </Form>
                <OwnerSelector resource={data.resource} />
                <HorizontalRule doubleSpacing />

                <TabContentTitle title={`Catalog Properties`} />
                <CustomPropertiesFormFields />
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
