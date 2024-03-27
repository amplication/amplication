import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  HorizontalRule,
  Panel,
  ToggleField,
  Form,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import NameField from "../Components/NameField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";
import DtoPropertyTypesField from "./DtoPropertyTypesField";
import "./ModuleDtoPropertyForm.scss";

type Props = {
  onSubmit: (values: models.ModuleDtoProperty) => void;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
  onPropertyClose?: (property: models.ModuleDtoProperty) => void;

  defaultValues?: models.ModuleDtoProperty;
  disabled?: boolean;
  isCustomDto: boolean;
  moduleDto: models.ModuleDto;
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
  moduleDto,
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
      <Panel
        style={{ padding: 0 }}
        className={CLASS_NAME}
        panelStyle={EnumPanelStyle.Transparent}
      >
        <Form>
          {!disabled && <FormikAutoSave debounceMS={1000} />}

          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            direction={EnumFlexDirection.Row}
          >
            <NameField
              label="Name"
              name="name"
              disabled={disabled || !isCustomDto}
            />

            <ToggleField name="isArray" label="Array" disabled={disabled} />
            <ToggleField
              name="isOptional"
              label="Optional"
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
