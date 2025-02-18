import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumVersionTagState,
  FlexItem,
  Form,
  Panel,
  ToggleField,
  VersionTag,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo, useState } from "react";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import PrivatePluginVersionCodeField from "./PrivatePluginVersionCodeField";
import "./PrivatePluginVersionForm.scss";

type Props = {
  onSubmit: (values: models.PrivatePluginVersion) => void;
  onVersionClose?: (enumMember: models.PrivatePluginVersion) => void;
  defaultValues?: models.PrivatePluginVersion;
  disabled?: boolean;
  privatePlugin: models.PrivatePlugin;
};

const NON_INPUT_GRAPHQL_PROPERTIES = ["__typename"];

export const INITIAL_VALUES: Partial<models.PrivatePluginVersion> = {
  version: "",
  enabled: true,
  deprecated: false,
  settings: null,
  configurations: null,
};

const FORM_SCHEMA = {};

const CLASS_NAME = "private-plugin-version-form";

const PrivatePluginVersionForm = ({
  onSubmit,
  onVersionClose,
  defaultValues,
  disabled,
  privatePlugin,
}: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
    } as models.PrivatePluginVersion;
  }, [defaultValues]);

  //we are not using auto-save to allow the use to save the changes only after they have finished editing
  const handleChange = (formik) => {
    formik.submitForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.PrivatePluginVersion) =>
        validate(values, FORM_SCHEMA)
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
            <Form>
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                direction={EnumFlexDirection.Row}
                end={
                  <>
                    <Button
                      buttonStyle={EnumButtonStyle.Text}
                      icon="edit_2"
                      disabled={disabled}
                      onClick={() => {
                        setShowDetails(!showDetails);
                      }}
                    />
                  </>
                }
              >
                <VersionTag
                  version={initialValues.version}
                  state={
                    !formik.values.enabled
                      ? EnumVersionTagState.Disabled
                      : formik.values.deprecated
                      ? EnumVersionTagState.Deprecated
                      : EnumVersionTagState.Current
                  }
                />

                <ToggleField
                  label="Enabled"
                  name="enabled"
                  disabled={disabled}
                  onValueChange={() => {
                    handleChange(formik);
                  }}
                />
              </FlexItem>
              {showDetails && (
                <FlexItem
                  direction={EnumFlexDirection.Column}
                  itemsAlign={EnumItemsAlign.End}
                >
                  <FlexItem
                    direction={EnumFlexDirection.Row}
                    margin={EnumFlexItemMargin.Top}
                  >
                    <PrivatePluginVersionCodeField
                      name="settings"
                      label="Settings"
                      initialValue={initialValues.settings}
                    />
                    <PrivatePluginVersionCodeField
                      name="configurations"
                      label="Configurations"
                      initialValue={initialValues.configurations}
                    />
                  </FlexItem>
                  <Button
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={disabled || !formik.isValid || !formik.dirty}
                    onClick={() => {
                      handleChange(formik);
                    }}
                  >
                    Save
                  </Button>
                </FlexItem>
              )}
            </Form>
          </Panel>
        );
      }}
    </Formik>
  );
};

export default PrivatePluginVersionForm;
