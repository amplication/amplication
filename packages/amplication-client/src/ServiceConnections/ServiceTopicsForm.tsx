import { HorizontalRule, ToggleField } from "@amplication/ui/design-system";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { Form } from "../Components/Form";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { EnumResourceType, ServiceTopics, Resource } from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import "./ServiceTopics.scss";
import TopicsList from "./topics/TopicsList";

// This must be here unless we get rid of deepdash as it does not support ES imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitDeep = require("deepdash/omitDeep");

const CLASS_NAME = "service-topics";

type Props = {
  onSubmit: (values: ServiceTopics) => void;
  defaultValues?: ServiceTopics;
  connectedResource: Resource;
};

const NON_INPUT_GRAPHQL_PROPERTIES = ["id", "__typename"];

export const INITIAL_VALUES: Partial<ServiceTopics> = {
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

const ServiceTopicsForm = ({
  onSubmit,
  defaultValues,
  connectedResource,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      defaultValues || {},
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as ServiceTopics;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: ServiceTopics) => {
        return validate(values, FORM_SCHEMA);
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form childrenAsBlocks>
          <FormikAutoSave debounceMS={1000} />
          <div className={`${CLASS_NAME}__header`}>
            <div className={`${CLASS_NAME}__header__top`}>
              <ResourceCircleBadge type={EnumResourceType.MessageBroker} />
              <div className={`${CLASS_NAME}__header__top__title`}>
                {connectedResource?.name}
              </div>
              <ToggleField name="enabled" label="" />
            </div>
            <div className={`${CLASS_NAME}__header__description`}>
              Select the topics to handle in this service, and the message
              pattern for each topic.
            </div>
          </div>
          <HorizontalRule />
          <div className={`${CLASS_NAME}__list`}>
            <TopicsList
              messageBrokerId={connectedResource.id}
              enabled={Boolean(defaultValues?.enabled || false)}
              messagePatterns={values.patterns}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ServiceTopicsForm;
