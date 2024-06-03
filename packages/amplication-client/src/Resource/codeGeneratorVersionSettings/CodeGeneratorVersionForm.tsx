import { Form, SelectField, ToggleField } from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import { Formik } from "formik";
import {
  EntitlementType,
  FeatureIndicatorContainer,
  FeatureIndicatorPlacement,
} from "../../Components/FeatureIndicatorContainer";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";
import "./CodeGeneratorVersionForm.scss";

const CLASS_NAME = "code-generator-version-form";

export type CodeGenerationVersionSettings = {
  useSpecificVersion: boolean;
  version: string;
  autoUseLatestMinorVersion: boolean;
};

type Props = {
  defaultValues: CodeGenerationVersionSettings;
  codeGeneratorVersionList: string[];
  onSubmit: (values: CodeGenerationVersionSettings) => void;
};

const FORM_SCHEMA = {
  properties: {
    useSpecificVersion: {
      type: "boolean",
    },
    autoUseLatestMinorVersion: {
      type: "boolean",
    },
    version: {
      type: "string",
    },
  },
};

const CodeGeneratorVersionForm: React.FC<Props> = ({
  onSubmit,
  defaultValues,
  codeGeneratorVersionList,
}) => {
  const { stigg } = useStiggContext();
  const canChooseCodeGeneratorVersion = stigg.getBooleanEntitlement({
    featureId: BillingFeature.CodeGeneratorVersion,
  }).hasAccess;

  return (
    <Formik
      initialValues={defaultValues}
      validate={(values: CodeGenerationVersionSettings) => {
        const errors = validate(values, FORM_SCHEMA);
        if (errors.version) {
          errors.version = "Please select a version";
        }
        return errors;
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <FormikAutoSave debounceMS={200} />
            <div className={CLASS_NAME}>
              <FeatureIndicatorContainer
                featureId={BillingFeature.CodeGeneratorVersion}
                entitlementType={EntitlementType.Boolean}
                featureIndicatorPlacement={FeatureIndicatorPlacement.Outside}
                limitationText="Available in Enterprise plans only. "
              >
                <ToggleField
                  label="I want to select a specific version of the code generator"
                  name="useSpecificVersion"
                />
              </FeatureIndicatorContainer>

              {formik.values.useSpecificVersion && (
                <>
                  <SelectField
                    disabled={
                      !canChooseCodeGeneratorVersion &&
                      !formik.values.useSpecificVersion
                    }
                    label={"Select a version"}
                    name={"version"}
                    options={
                      codeGeneratorVersionList?.map((version) => ({
                        label: version,
                        value: version,
                      })) || []
                    }
                  />

                  <ToggleField
                    disabled={
                      !canChooseCodeGeneratorVersion ||
                      !formik.values.useSpecificVersion ||
                      (formik.values.useSpecificVersion &&
                        !formik.values.version)
                    }
                    label="Automatically use new minor version when available"
                    name={"autoUseLatestMinorVersion"}
                  />
                </>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CodeGeneratorVersionForm;
