import {
  EnumTextStyle,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useContext } from "react";
import EntitySelectField from "../../Components/EntitySelectField";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import useResource from "../hooks/useResource";
import useSettingsHook from "../useSettingsHook";

const CLASS_NAME = "generation-settings-form";

function AuthenticationSettingsForm() {
  const { currentResource } = useContext(AppContext);
  const { serviceSettings, updateServiceSettings } = useResource(
    currentResource.id
  );

  const { trackEvent } = useTracking();

  const resourceId = currentResource?.id;
  const { handleSubmit, SERVICE_CONFIG_FORM_SCHEMA } = useSettingsHook({
    trackEvent,
    resourceId,
    updateResourceSettings: updateServiceSettings,
  });

  return (
    <div className={CLASS_NAME}>
      {serviceSettings?.serviceSettings && (
        <Formik
          initialValues={serviceSettings.serviceSettings}
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
