import { Snackbar, TextField } from "@amplication/ui/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { match } from "react-router-dom";
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
import { UPDATE_RESOURCE } from "../Workspaces/queries/resourcesQueries";
import "./ResourceForm.scss";
import { GET_RESOURCE } from "./ResourceHome";

type Props = {
  match: match<{ resource: string }>;
};

type TData = {
  updateResource: models.Resource;
};

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

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
      name: AT_LEAST_TWO_CHARARCTERS,
    },
  },
};

const CLASS_NAME = "resource-form";

function ResourceForm({ match }: Props) {
  const resourceId = match.params.resource;

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
    (data) => {
      const { name, description } = data;
      trackEvent({
        eventName: AnalyticsEventNames.ResourceInfoUpdate,
      });
      updateResource({
        variables: {
          data: {
            name,
            description,
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
              <Form>
                <div className={`${CLASS_NAME}__header`}>
                  <h3>General Settings</h3>
                  <h5>Enter a name and description for your app.</h5>
                </div>
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
