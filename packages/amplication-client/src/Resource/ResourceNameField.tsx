import { Icon, Tooltip } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import { useCallback } from "react";
import { useTracking } from "react-tracking";
import { GET_PROJECTS } from "../Workspaces/queries/projectQueries";
import { UPDATE_RESOURCE } from "../Workspaces/queries/resourcesQueries";
import * as models from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import "./ResourceNameField.scss";

type Props = {
  currentResource: models.Resource;
  resourceId: string;
};

type TData = {
  updateResource: models.Resource;
};

const CLASS_NAME = "resource-namefield";

const SYMBOL_REGEX = "^[a-zA-Z0-9\\s]+$";
const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
      pattern: SYMBOL_REGEX,
    },
  },
};
const ResourceNameField = ({ currentResource, resourceId }: Props) => {
  const { trackEvent } = useTracking();
  const [updateResource] = useMutation<TData>(UPDATE_RESOURCE, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  const handleSubmit = useCallback(
    (data) => {
      const { name } = data;
      trackEvent({
        eventName: AnalyticsEventNames.ResourceInfoUpdate,
      });
      updateResource({
        variables: {
          data: {
            name,
          },
          resourceId: resourceId,
        },
      }).catch(console.error);
    },
    [updateResource, resourceId, trackEvent]
  );

  return (
    <div className={`${CLASS_NAME}__input__container`}>
      <Formik
        initialValues={{ name: currentResource?.name }}
        validate={(values: models.Resource) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ errors, isValid }) => {
          return (
            <div className={`${CLASS_NAME}__form`}>
              <Form>
                <FormikAutoSave debounceMS={1000} />
                <Field
                  autoFocus={true}
                  className={`${CLASS_NAME}__input`}
                  name="name"
                  as="input"
                />
                {!isValid && (
                  <Tooltip
                    noDelay
                    direction="nw"
                    aria-label={"Error: Unsupported character"}
                    className={`${CLASS_NAME}__tooltip_invalid`}
                  >
                    <Icon
                      icon="info_circle"
                      size="small"
                      className={`${CLASS_NAME}__invalid`}
                    />
                  </Tooltip>
                )}
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ResourceNameField;
