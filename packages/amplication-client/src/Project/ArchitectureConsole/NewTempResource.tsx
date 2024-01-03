import { Text, TextField, EnumTextAlign } from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { validate } from "../../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../../util/hotkeys";
import { generatedKey } from "../../Plugins/InstalledPluginSettings";
import * as models from "../../models";
import { EnumResourceType } from "../../models";

type Props = {
  onSuccess: (newResource: models.Resource) => void;
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
const CLASS_NAME = "new-entity";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewTempResource = ({ onSuccess }: Props) => {
  const handleSubmit = useCallback(
    (data) => {
      const tempId = generatedKey();
      onSuccess({
        tempId: tempId,
        builds: [],
        createdAt: new Date(),
        description: `create service: ${data.name} from architecture model`,
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
      <SvgThemeImage image={EnumImages.Entities} />
      <Text textAlign={EnumTextAlign.Center}>
        Give your new service a descriptive name.
      </Text>

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
                label="New Service Name"
                // disabled={loading}
                autoFocus
                hideLabel
                placeholder="Type New Service Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                // disabled={!formik.isValid || loading}
              >
                Create Service
              </Button>
            </Form>
          );
        }}
      </Formik>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </div>
  );
};

export default NewTempResource;
