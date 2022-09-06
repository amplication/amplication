import { HorizontalRule, ToggleField } from "@amplication/design-system";
import omitDeep from "deepdash-es/omitDeep";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { Form } from "../Components/Form";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import "./ServiceMessageBrokerConnection.scss";
import TopicsList from "./topics/TopicsList";

const CLASS_NAME = "service-message-broker-connection";

type Props = {
  onSubmit: (values: models.ServiceMessageBrokerConnection) => void;
  defaultValues: models.ServiceMessageBrokerConnection;
  connectedResource: models.Resource;
};

const NON_INPUT_GRAPHQL_PROPERTIES = ["id", "__typename"];

export const INITIAL_VALUES: Partial<models.ServiceMessageBrokerConnection> = {
  displayName: "",
  description: "",
  enabled: false,
  patterns: [],
};

const FORM_SCHEMA = {
  required: ["enabled"],
  properties: {
    enabled: {
      type: "boolean",
    },
  },
};

const ServiceMessageBrokerConnectionForm = ({
  onSubmit,
  defaultValues,
  connectedResource,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.ServiceMessageBrokerConnection;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ServiceMessageBrokerConnection) => {
        return validate(values, FORM_SCHEMA);
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form childrenAsBlocks>
          <FormikAutoSave debounceMS={1000} />
          <div className={`${CLASS_NAME}__row`}>
            <ResourceCircleBadge
              type={models.EnumResourceType.MessageBroker}
              size="medium"
            />
            <span className={`${CLASS_NAME}__title`}>
              {connectedResource?.name}
            </span>
            <span className="spacer" />

            <ToggleField name="enabled" label="enabled" />
          </div>

          <div className={`${CLASS_NAME}__row`}>
            <span className={`${CLASS_NAME}__description`}>
              description about message broker and topic{" "}
            </span>
          </div>

          <HorizontalRule />

          <TopicsList
            messageBrokerId={connectedResource.id}
            enabled={Boolean(defaultValues.enabled)}
            messagePatterns={values.patterns}
          />
        </Form>
      )}
    </Formik>
  );
};

export default ServiceMessageBrokerConnectionForm;
