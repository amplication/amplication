import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
  ToggleField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import DtoPropertyTypeSelectField from "../Components/DtoPropertyTypeSelectField";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import { DeleteModuleDtoProperty } from "./DeleteModuleDtoProperty";
import "./ModuleDtoPropertyForm.scss";

type Props = {
  onSubmit: (values: models.ModuleDtoProperty) => void;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
  defaultValues?: models.ModuleDtoProperty;
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
  "displayName", //display name is not used for properties
];

export const INITIAL_VALUES: Partial<models.Module> = {
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

const CLASS_NAME = "module-dto-property-form";

const ModuleDtoPropertyForm = ({
  onSubmit,
  onPropertyDelete,
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
    } as models.ModuleDtoProperty;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ModuleDtoProperty) =>
        validate(values, FORM_SCHEMA)
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form className={CLASS_NAME}>
        {!disabled && <FormikAutoSave debounceMS={1000} />}

        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          direction={EnumFlexDirection.Row}
          end={
            <DeleteModuleDtoProperty
              moduleDtoProperty={defaultValues}
              onPropertyDelete={onPropertyDelete}
            />
          }
        >
          <ToggleField name="isArray" label="Array" disabled={disabled} />
          <ToggleField name="isOptional" label="Optional" disabled={disabled} />
          <NameField
            label="Name"
            name="name"
            disabled={disabled || !isCustomDto}
          />
          <DtoPropertyTypeSelectField
            label={"Type"}
            name={"propertyType"}
            disabled={disabled}
          ></DtoPropertyTypeSelectField>
        </FlexItem>

        <OptionalDescriptionField
          name="description"
          label="Description"
          disabled={disabled}
        />
      </Form>
    </Formik>
  );
};

export default ModuleDtoPropertyForm;
