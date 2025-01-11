import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Form,
  Panel,
  TextField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import NameField from "../Components/NameField";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";

type Props = {
  onSubmit: (values: models.ModuleDtoEnumMember) => void;
  onEnumMemberDelete?: (enumMember: models.ModuleDtoEnumMember) => void;
  onEnumMemberClose?: (enumMember: models.ModuleDtoEnumMember) => void;

  defaultValues?: models.ModuleDtoEnumMember;
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

export const INITIAL_VALUES: Partial<models.ModuleDtoEnumMember> = {
  name: "",
  value: "",
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

const ModuleDtoEnumMemberForm = ({
  onSubmit,
  onEnumMemberDelete,
  onEnumMemberClose,
  defaultValues,
  disabled,
  isCustomDto,
  moduleDto,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      {
        ...defaultValues,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );

    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.ModuleDtoEnumMember;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.ModuleDtoEnumMember) =>
        validate(values, FORM_SCHEMA)
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Panel style={{ padding: 0 }} panelStyle={EnumPanelStyle.Transparent}>
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
            <TextField
              label="Value"
              name="value"
              disabled={disabled || !isCustomDto}
            />
          </FlexItem>
        </Form>
      </Panel>
    </Formik>
  );
};

export default ModuleDtoEnumMemberForm;
