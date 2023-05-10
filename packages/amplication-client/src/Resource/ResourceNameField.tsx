import React, { useCallback, useState } from "react";
import { Field, Form, Formik } from "formik";
import FormikAutoSave from "../util/formikAutoSave";
import { Icon, Tooltip } from "@amplication/ui/design-system";
import { validate } from "../util/formikValidateJsonSchema";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useTracking } from "react-tracking";
import { useMutation } from "@apollo/client";
import { UPDATE_RESOURCE } from "../Workspaces/queries/resourcesQueries";
import { GET_PROJECTS } from "../Workspaces/queries/projectQueries";
import * as models from "../models";
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
  const [isEditing, setIsEditing] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { trackEvent } = useTracking();
  const [updateResource] = useMutation<TData>(UPDATE_RESOURCE, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  const handleBlur = (isValid: boolean) => {
    if (isValid) {
      setIsEditing(false);
      setShowTick(false);
      setHovered(false);
    }
  };

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
      setShowTick(true);
      setTimeout(() => {
        setShowTick(false);
      }, 3000);
    },
    [updateResource, resourceId, trackEvent]
  );

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
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
              {isEditing ? (
                <Form>
                  <FormikAutoSave debounceMS={1000} />
                  <Field
                    autoFocus={true}
                    className={`${CLASS_NAME}__input`}
                    name="name"
                    as="input"
                    onBlur={() => handleBlur(isValid)}
                  />
                  {isValid ? (
                    showTick && (
                      <Icon
                        className={`${CLASS_NAME}__saved`}
                        icon="check"
                        size="medium"
                      />
                    )
                  ) : (
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
              ) : (
                <div
                  className={`${CLASS_NAME}__edit`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className={`${CLASS_NAME}__text`}>
                    {currentResource?.name}
                  </span>
                  <div
                    onClick={() => setIsEditing(true)}
                    className={`${CLASS_NAME}__edit_icon`}
                  >
                    {hovered && <Icon icon="edit_2" size="medium" />}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ResourceNameField;
