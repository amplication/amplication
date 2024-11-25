import {
  Button,
  EnumButtonStyle,
  FlexItem,
  Form,
  TextField,
  ToggleField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import BlueprintSelectField from "./BlueprintSelectField";

type Props = {
  blueprintRelation: models.BlueprintRelation;
  onSubmit: (blueprintRelation: models.BlueprintRelation) => void;
};
const NON_INPUT_GRAPHQL_PROPERTIES = ["__typename"];

const FORM_SCHEMA = {
  required: ["name", "key", "relatedTo"],

  errorMessage: {},
};

const BlueprintRelationForm = ({
  onSubmit,
  blueprintRelation: defaultValues,
}: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...sanitizedDefaultValues,
    } as models.BlueprintRelation;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.BlueprintRelation) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <DisplayNameField name="name" label="Name" minLength={1} />
            <TextField name="key" label="Key" />

            <TextField
              name={"description"}
              label={"Description"}
              autoComplete="off"
              textarea
              textareaSize="small"
              rows={3}
            />

            <BlueprintSelectField
              useKeyAsValue
              name="relatedTo"
              label="Related to"
            />

            <div>
              <ToggleField name="allowMultiple" label="Allow multiple" />
            </div>
            <div>
              <ToggleField name="required" label="Required" />
            </div>
            <div>
              <FlexItem
                end={
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Save changes
                  </Button>
                }
              ></FlexItem>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BlueprintRelationForm;
