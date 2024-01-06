import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
  Panel,
  ToggleField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import { DeleteModuleDtoProperty } from "./DeleteModuleDtoProperty";
import DtoPropertyTypesField from "./DtoPropertyTypesField";
import "./ModuleDtoPropertyForm.scss";

type Props = {
  onSubmit: (values: models.ModuleDtoProperty) => void;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
  onPropertyClose?: (property: models.ModuleDtoProperty) => void;

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

const TYPES_NON_INPUT_GRAPHQL_PROPERTIES = ["__typename"];

export const INITIAL_VALUES: Partial<models.ModuleDtoProperty> = {
  name: "",
  propertyTypes: [
    {
      type: models.EnumModuleDtoPropertyType.String,
      isArray: false,
    },
  ],
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
  onPropertyClose,
  defaultValues,
  disabled,
  isCustomDto,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      {
        ...defaultValues,
        propertyTypes: defaultValues.propertyTypes.map((propertyType) => {
          return omit(propertyType, TYPES_NON_INPUT_GRAPHQL_PROPERTIES);
        }),
      },
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
      <Panel className={CLASS_NAME}>
        <Form>
          {!disabled && <FormikAutoSave debounceMS={1000} />}

          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            direction={EnumFlexDirection.Row}
            end={
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <Button
                  icon="close"
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => {
                    onPropertyClose(defaultValues);
                  }}
                ></Button>
                <DeleteModuleDtoProperty
                  moduleDtoProperty={defaultValues}
                  onPropertyDelete={onPropertyDelete}
                />
              </FlexItem>
            }
          >
            <NameField
              label="Name"
              name="name"
              disabled={disabled || !isCustomDto}
            />
          </FlexItem>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            direction={EnumFlexDirection.Row}
            margin={EnumFlexItemMargin.Both}
          >
            <ToggleField name="isArray" label="Array" disabled={disabled} />
            <ToggleField
              name="isOptional"
              label="Optional"
              disabled={disabled}
            />
          </FlexItem>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            direction={EnumFlexDirection.Row}
            margin={EnumFlexItemMargin.Both}
          >
            <OptionalDescriptionField
              name="description"
              label="Description"
              disabled={disabled}
            />
          </FlexItem>
          <DtoPropertyTypesField name="propertyTypes" />
        </Form>
      </Panel>
    </Formik>
  );
};

export default ModuleDtoPropertyForm;
