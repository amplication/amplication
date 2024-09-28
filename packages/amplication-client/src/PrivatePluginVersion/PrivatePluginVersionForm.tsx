import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Form,
  Panel,
  ToggleField,
  VersionTag,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import * as models from "../models";
import FormikAutoSave from "../util/formikAutoSave";
import { validate } from "../util/formikValidateJsonSchema";

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

const PrivatePluginVersionForm = ({
  onSubmit,
  onVersionClose,
  defaultValues,
  disabled,
  privatePlugin,
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
    } as models.PrivatePluginVersion;
  }, [defaultValues]);

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
          <Panel style={{ padding: 0 }} panelStyle={EnumPanelStyle.Transparent}>
            <Form>
              {!disabled && <FormikAutoSave debounceMS={1000} />}

              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                direction={EnumFlexDirection.Row}
              >
                <VersionTag
                  version={initialValues.version}
                  state={
                    !formik.values.enabled
                      ? "disabled"
                      : formik.values.deprecated
                      ? "deprecated"
                      : "current"
                  }
                />

                <ToggleField label="Enabled" name="enabled" />
                <ToggleField label="Deprecated" name="deprecated" />
              </FlexItem>
            </Form>
          </Panel>
        );
      }}
    </Formik>
  );
};

export default PrivatePluginVersionForm;
