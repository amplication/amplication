import { Text, TextField, EnumTextAlign } from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { validate } from "../../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../../util/hotkeys";
import { generatedKey } from "../../Plugins/InstalledPluginSettings";
import * as models from "../../models";
import { EnumResourceType } from "../../models";
import "./CreateResource.scss";

type Props = {
  onSuccess: (newResource: models.Resource) => void;
  title: string;
  actionDescription: string;
};

const INITIAL_VALUES = {
  name: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
};
const CLASS_NAME = "create-resource";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const CreateResource = ({ onSuccess, title, actionDescription }: Props) => {
  const handleSubmit = useCallback(
    (data) => {
      const tempId = generatedKey();
      onSuccess({
        builds: [],
        createdAt: new Date(),
        description: "",
        entities: [],
        environments: [],
        gitRepositoryOverride: false,
        id: tempId,
        licensed: true,
        name: data.name,
        resourceType: EnumResourceType.Service,
        updatedAt: new Date(),
      });
    },
    [onSuccess]
  );

  return (
    <div className={CLASS_NAME}>
      <Text textAlign={EnumTextAlign.Right}>{actionDescription}</Text>

      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values) => validate(values, FORM_SCHEMA)}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                name="name"
                label={title}
                autoFocus
                hideLabel
                placeholder="Type New Service Name"
                autoComplete="off"
              />
              <Button type="submit" buttonStyle={EnumButtonStyle.Primary}>
                Create Service
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateResource;
