import { useContext } from "react";
import * as models from "../../models";
import { AppContext } from "../../context/appContext";
import { Form, Formik } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import { useTracking } from "../../util/analytics";
import useSettingsHook from "../useSettingsHook";
import EntitySelectField from "../../Components/EntitySelectField";
import FormikAutoSave from "../../util/formikAutoSave";
import useResource from "../hooks/useResource";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";

const CLASS_NAME = "generation-settings-form";

function AuthenticationSettingsForm() {
  const { currentResource } = useContext(AppContext);
  const { resourceSettings, updateResourceSettings } = useResource(
    currentResource.id
  );

  const { trackEvent } = useTracking();

  const resourceId = currentResource?.id;
  const { handleSubmit, SERVICE_CONFIG_FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    resourceId,
    updateResourceSettings,
  });

  return (
    <div className={CLASS_NAME}>
      {resourceSettings?.serviceSettings && (
        <Formik
          initialValues={resourceSettings.serviceSettings}
          validate={(values: models.ServiceSettings) =>
            validate(values, SERVICE_CONFIG_FORM_SCHEMA)
          }
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Text textStyle={EnumTextStyle.H4}>
                  Choose authentication entity
                </Text>
                <Text textStyle={EnumTextStyle.Tag}>
                  Select the entity to be used for authentication. The chosen
                  entity must include 'username' and 'password' fields.
                </Text>
                <HorizontalRule />

                <FormikAutoSave debounceMS={200} />
                <EntitySelectField
                  label={"Entity List"}
                  name="authEntityName"
                  resourceId={resourceId}
                  isValueId={false}
                />
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

export default AuthenticationSettingsForm;
