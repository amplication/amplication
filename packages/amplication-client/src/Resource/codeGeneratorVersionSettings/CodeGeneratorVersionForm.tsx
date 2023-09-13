import {
  Form,
  Icon,
  SelectField,
  ToggleField,
} from "@amplication/ui/design-system";
import { BillingFeature } from "../../util/BillingFeature";
import { useStiggContext } from "@stigg/react-sdk";
import { Formik } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import "./CodeGeneratorVersionForm.scss";
import FormikAutoSave from "../../util/formikAutoSave";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

const CLASS_NAME = "code-generator-version-form";

const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#F85B6E",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#15192C",
    color: "#ffffff",
    maxWidth: 360,
    border: "1px solid #F85B6E",
    borderRadius: "4px",
    padding: "6px",
    fontFamily: "unset",
    fontSize: "10px",
    fontWeight: "unset",
  },
}));

export type CodeGenerationVersionSettings = {
  useSpecificVersion: boolean;
  version: string;
  autoUseLatestMinorVersion: boolean;
};

type Props = {
  defaultValues: CodeGenerationVersionSettings;
  codeGeneratorVersionList: string[];
  onSubmit: (values: CodeGenerationVersionSettings) => void;
  onViewPlansClick: () => void;
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
  onViewPlansClick,
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
              <div>
                <>
                  <ToggleField
                    label="I want to select a specific version of the code generator"
                    name={"useSpecificVersion"}
                    disabled={!canChooseCodeGeneratorVersion}
                  />
                  {!canChooseCodeGeneratorVersion && (
                    <WarningTooltip
                      arrow
                      placement="top-start"
                      title={
                        <div className={`${CLASS_NAME}__tooltip__window`}>
                          <Icon icon="info_circle" />
                          <div
                            className={`${CLASS_NAME}__tooltip__window__info`}
                          >
                            <span>This feature requires a Pro plan.</span>{" "}
                            <Link
                              onClick={onViewPlansClick}
                              className={`${CLASS_NAME}__view_plans_link`}
                              to={{}}
                            >
                              View Plans
                            </Link>
                          </div>
                        </div>
                      }
                    >
                      <img
                        className={`${CLASS_NAME}__lock`}
                        src={`../../../../assets/images/lock.svg`}
                        alt=""
                      />
                    </WarningTooltip>
                  )}
                </>
                {formik.values.useSpecificVersion && (
                  <div>
                    <SelectField
                      disabled={
                        !canChooseCodeGeneratorVersion &&
                        !formik.values.useSpecificVersion
                      }
                      label={"Select a version"}
                      name={"version"}
                      options={codeGeneratorVersionList.map((version) => ({
                        label: version,
                        value: version,
                      }))}
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
                  </div>
                )}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CodeGeneratorVersionForm;
