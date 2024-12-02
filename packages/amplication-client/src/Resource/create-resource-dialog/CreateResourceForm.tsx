import {
  Button,
  EnumButtonStyle,
  FlexItem,
  Form,
  SelectField,
  TextField,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { DisplayNameField } from "../../Components/DisplayNameField";
import { validate } from "../../util/formikValidateJsonSchema";
import BlueprintSelectField from "../../Blueprints/BlueprintSelectField";
import { OwnerSelector } from "../../Components/OwnerSelector";
import CustomPropertiesFormFields from "../../CustomProperties/CustomPropertiesFormFields";

export type CreateResourceType = {
  name: string;
  description?: string;
};

type Props = {
  initialValue: CreateResourceType;
  onSubmit: (value: CreateResourceType) => void;
};

const FORM_SCHEMA = {
  required: ["name"],

  errorMessage: {},
};

const CreateResourceForm = ({ onSubmit, initialValue }: Props) => {
  return (
    <>
      <Formik
        initialValues={initialValue}
        validate={(values: CreateResourceType) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <BlueprintSelectField
              name="blueprint"
              label="Blueprint"
              isMulti={false}
            />
            <SelectField name="project" label="Project" options={[]} />

            <DisplayNameField name="name" label="Name" minLength={1} />

            {/* <OwnerSelector resource={{}} /> */}

            <TextField
              name={"description"}
              label={"Description"}
              autoComplete="off"
              textarea
              textareaSize="small"
              rows={3}
            />
            <CustomPropertiesFormFields />
            <CustomPropertiesFormFields />
            <CustomPropertiesFormFields />
            <CustomPropertiesFormFields />
            <CustomPropertiesFormFields />

            <div>
              <FlexItem
                end={
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Create Resource
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

export default CreateResourceForm;
