import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import { validate } from "../util/formikValidateJsonSchema";

import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { TextField, Snackbar, Icon } from "@amplication/design-system";
import { COLORS } from "./constants";
import { ColorSelectButton } from "../Components/ColorSelectButton";
import { useTracking } from "../util/analytics";
import { GET_RESOURCE } from "./ResourceHome";
import "./ResourceForm.scss";
import { UPDATE_RESOURCE } from "../Workspaces/queries/resourcesQueries";

type Props = {
  match: match<{ resource: string }>;
};

type TData = {
  updateResource: models.Resource;
};

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
    UPDATE_RESOURCE
  );

  const handleSubmit = useCallback(
    (data) => {
      const { name, description, color } = data;
      trackEvent({
        eventName: "updateResourceInfo",
      });
      updateResource({
        variables: {
          data: {
            name,
            description,
            color,
          },
          resourceId: resourceId,
        },
      }).catch(console.error);
    },
    [updateResource, resourceId, trackEvent]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      trackEvent({
        eventName: "updateResourceColor",
      });
      updateResource({
        variables: {
          data: {
            color,
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
        <>
          <Formik
            initialValues={data.resource}
            validate={(values: models.Resource) =>
              validate(values, FORM_SCHEMA)
            }
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <div className={`${CLASS_NAME}__header`}>
                    <h3>General Settings</h3>
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

          <div>
            <hr />
            <h3>
              <Icon icon="color" />
              Resource Color
            </h3>
            {COLORS.map((color) => (
              <ColorSelectButton
                color={color}
                key={color.value}
                onColorSelected={handleColorChange}
              />
            ))}
          </div>
        </>
      )}
      <Snackbar
        open={Boolean(error?.message || updateError?.message)}
        message={errorMessage}
      />
    </div>
  );
}

export default ResourceForm;
