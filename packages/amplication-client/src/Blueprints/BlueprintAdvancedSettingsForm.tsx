import {
  Form,
  OptionItem,
  SelectField,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.Blueprint) => void;
  blueprint: models.Blueprint;
};

const RESOURCE_TYPES_OPTIONS: OptionItem[] = [
  { value: models.EnumResourceType.Component, label: "Custom Resource" },
  {
    value: models.EnumResourceType.Service,
    label: "Service (Amplication's Standard)",
  },
  {
    value: models.EnumResourceType.MessageBroker,
    label: "Message Broker (Amplication's Standard)",
  },
];

const CODE_GENERATOR_OPTIONS: OptionItem[] = [
  {
    value: models.EnumCodeGenerator.DotNet,
    label: ".NET",
  },
  {
    value: models.EnumCodeGenerator.NodeJs,
    label: "Node.js",
  },
];

const FORM_SCHEMA = {
  required: ["resourceType", "codeGenerator"],
  properties: {
    codeGenerator: {
      type: "string",
      enum: [models.EnumCodeGenerator.DotNet, models.EnumCodeGenerator.NodeJs],
    },
  },
  errorMessage: {
    properties: {
      resourceType: "Resource Type is required",
      codeGenerator: "Code Generator is required",
    },
  },
};

const BlueprintAdvancedSettingsForm = ({ onSubmit, blueprint }: Props) => {
  return (
    <>
      <Formik
        initialValues={blueprint}
        validate={(values: models.Blueprint) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <FormikAutoSave debounceMS={1000} />
            <TabContentTitle
              title="Engine Settings"
              subTitle="Do not change these settings unless you are sure of what you are doing"
            />
            <SelectField
              options={RESOURCE_TYPES_OPTIONS}
              label="Resource Type"
              name="resourceType"
            />
            {formik.values.resourceType === models.EnumResourceType.Service && (
              <SelectField
                options={CODE_GENERATOR_OPTIONS}
                label="Code Generator"
                name="codeGenerator"
              />
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BlueprintAdvancedSettingsForm;
