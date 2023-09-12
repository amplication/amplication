import {
  Form,
  Panel,
  SelectField,
  ToggleField,
} from "@amplication/ui/design-system";
import { BillingFeature } from "../../util/BillingFeature";
import { useStiggContext } from "@stigg/react-sdk";
import { Formik } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import "./CodeGeneratorVersionForm.scss";
import FormikAutoSave from "../../util/formikAutoSave";

const CLASS_NAME = "code-generator-version-form";

export type CodeGenerationVersionSettings = {
  useSpecificVersion: boolean;
  version: string;
  autoUseLatestMinorVersion: boolean;
};

type Props = {
  defaultValues: CodeGenerationVersionSettings;
  latestMajorVersion: string;
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
  latestMajorVersion,
}) => {
  const { stigg } = useStiggContext();
  const canChooseCodeGeneratorVersion = stigg.getBooleanEntitlement({
    featureId: BillingFeature.CodeGeneratorVersion,
  }).hasAccess;

  return (
    <Formik
      initialValues={defaultValues}
      validate={(values: CodeGenerationVersionSettings) =>
        validate(values, FORM_SCHEMA)
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <FormikAutoSave debounceMS={200} />
            <div className={CLASS_NAME}>
              <Panel>
                <div>
                  <p>
                    Code generator version used for the latest build:{" "}
                    {latestMajorVersion}{" "}
                  </p>

                  <div>
                    You can control the version of the code generator to be used
                    when generating the code. New major versions may include
                    breaking changes and updates to major version of core
                    frameworks like Node.js, NestJS, Prisma, etc.
                  </div>
                </div>
              </Panel>
              <p>
                In case you are not ready to upgrade to a new major version, you
                can select a specific Code Generator version
              </p>
              {canChooseCodeGeneratorVersion && (
                <div>
                  <ToggleField
                    label="I want to select a specific version of the code generator."
                    name={"useSpecificVersion"}
                  />
                  {formik.values.useSpecificVersion && (
                    <div>
                      <SelectField
                        disabled={!formik.values.useSpecificVersion}
                        label={"select version"}
                        name={"version"}
                        options={codeGeneratorVersionList.map((version) => ({
                          label: version,
                          value: version,
                        }))}
                      />
                      <ToggleField
                        disabled={!formik.values.useSpecificVersion}
                        label="Automatically use new minor version when available."
                        name={"autoUseLatestMinorVersion"}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CodeGeneratorVersionForm;
