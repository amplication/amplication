import {
  Panel,
  SelectField,
  Toggle,
  ToggleField,
} from "@amplication/ui/design-system";
import { BillingFeature } from "../../util/BillingFeature";
import { useStiggContext } from "@stigg/react-sdk";
import * as models from "../../models";
import { Formik } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";

const CLASS_NAME = "code-generator-version-form";

// type CodeGenerationProps = Pick<
//   models.Resource,
//   "codeGeneratorVersion" | "codeGeneratorStrategy"
// >;

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
    codeGeneratorVersion: {
      type: "string",
    },
    codeGeneratorStrategy: {
      type: models.CodeGeneratorVersionStrategy,
    },
  },
  required: ["codeGeneratorStrategy"],
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
      <div className={CLASS_NAME}>
        <Panel>
          <div>
            <p>
              Code generator version used for the latest build:{" "}
              {latestMajorVersion}{" "}
            </p>

            <div>
              You can control the version of the code generator to be used when
              generating the code. New major versions may include breaking
              changes and updates to major version of core frameworks like
              Node.js, NestJS, Prisma, etc.
            </div>
          </div>
        </Panel>
        <p>
          In case you are not ready to upgrade to a new major version, you can
          select a specific Code Generator version
        </p>
        {canChooseCodeGeneratorVersion && (
          <div>
            <ToggleField
              label="I want to select a specific version of the code generator."
              name={"useSpecificVersion"}
            />
            <div>
              <SelectField
                label={"select version"}
                name={"version"}
                options={codeGeneratorVersionList.map((version) => ({
                  label: version,
                  value: version,
                }))}
              />
              <ToggleField
                label="Automatically use new minor version when available. "
                name={"autoUseLatestMinorVersion"}
              />
            </div>
          </div>
        )}
      </div>
    </Formik>
  );
};

export default CodeGeneratorVersionForm;
