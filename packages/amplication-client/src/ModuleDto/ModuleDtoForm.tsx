import { Form } from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";

type Props = {
  onSubmit: (values: models.ModuleDto) => void;
  defaultValues?: models.ModuleDto;
  disabled?: boolean;
  isCustomDto: boolean;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "lockedByUserId",
  "lockedAt",
  "lockedByUser",
  "parentBlockId",
  "resourceId",
  "relatedEntityId",
  "dtoType",
  "properties",
];

export const INITIAL_VALUES: Partial<models.ModuleDto> = {
  name: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const ModuleDtoForm = ({
  onSubmit,
  defaultValues,
  disabled,
  isCustomDto,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.ModuleDto;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ModuleDto) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        {!disabled && <FormikAutoSave debounceMS={1000} />}
        <NameField
          label="Name"
          name="name"
          disabled={disabled || !isCustomDto}
        />
        <OptionalDescriptionField
          name="description"
          label="Description"
          disabled={disabled}
        />
      </Form>
    </Formik>
  );
};

export default ModuleDtoForm;
