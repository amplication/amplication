import { FlexItem, Form } from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import GqlOperationSelectField from "../Components/GqlOperationSelectField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import RestVerbSelectField from "../Components/RestVerbSelectField";
import DtoPropertyTypesSelectField from "../ModuleDtoProperty/DtoPropertyTypesSelectField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";

type Props = {
  onSubmit: (values: models.ModuleAction) => void;
  defaultValues?: models.ModuleAction;
  disabled?: boolean;
  isCustomAction: boolean;
};
const TYPES_NON_INPUT_GRAPHQL_PROPERTIES = ["__typename"];

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "lockedByUserId",
  "lockedAt",
  "lockedByUser",
];

export const INITIAL_VALUES: Partial<models.ModuleAction> = {
  name: "",
  displayName: "",
  description: "",
  inputType: {
    type: models.EnumModuleDtoPropertyType.Dto,
    dtoId: "",
    isArray: false,
  },
  outputType: {
    type: models.EnumModuleDtoPropertyType.Dto,
    dtoId: "",
    isArray: false,
  },
  restVerb: models.EnumModuleActionRestVerb.Get,
  gqlOperation: models.EnumModuleActionGqlOperation.Query,
  path: "",
  enabled: true,
};

const FORM_SCHEMA = {
  required: ["name", "displayName"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const ModuleActionForm = ({
  onSubmit,
  defaultValues,
  disabled,
  isCustomAction,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      {
        ...defaultValues,
        inputType: omit(
          defaultValues?.inputType,
          TYPES_NON_INPUT_GRAPHQL_PROPERTIES
        ),
        outputType: omit(
          defaultValues?.outputType,
          TYPES_NON_INPUT_GRAPHQL_PROPERTIES
        ),
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.ModuleAction;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ModuleAction) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form>
        {!disabled && <FormikAutoSave debounceMS={1000} />}
        <FlexItem>
          <DisplayNameField
            name="displayName"
            label="Display Name"
            disabled={disabled}
          />
          <NameField
            label="Name"
            name="name"
            disabled={disabled || !isCustomAction}
          />
        </FlexItem>

        <RestVerbSelectField
          label={"Method"}
          name={"restVerb"}
          disabled={disabled || !isCustomAction}
        ></RestVerbSelectField>
        <GqlOperationSelectField
          name={"gqlOperation"}
          label={"Operation type"}
          disabled={disabled || !isCustomAction}
        ></GqlOperationSelectField>

        <DtoPropertyTypesSelectField name="inputType" label="Input Type" />
        <DtoPropertyTypesSelectField name="outputType" label="Output Type" />
        <OptionalDescriptionField
          name="description"
          label="Description"
          disabled={disabled}
        />
      </Form>
    </Formik>
  );
};

export default ModuleActionForm;
