import React, {
  useState,
  ReactNode,
  useCallback,
  MutableRefObject,
} from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import WizardProgressBar from "./WizardProgressBar";
import { ResourceSettings } from "./CreateServiceWizard";
import { Form, Formik, FormikErrors } from "formik";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";

interface ServiceWizardProps {
  children: ReactNode;
  wizardPattern: number[];
  wizardSchema: { [key: string]: any };
  wizardInitialValues: { [key: string]: any };
  context: {
    submitWizard: () => void;
    resourceSettingsRef: MutableRefObject<ResourceSettings>;
  };
  moduleCss: string;
}

const BackButton: React.FC<{
  activePageIndex: number;
  goPrevPage: () => void;
}> = ({ activePageIndex, goPrevPage }) =>
  activePageIndex > 0 ? <Button onClick={goPrevPage}>back</Button> : null;

const ContinueButton: React.FC<{
  goNextPage: () => void;
  disabled: boolean;
  buttonName: string;
}> = ({ goNextPage, disabled, buttonName }) => {
  return (
    <Button onClick={goNextPage} {...(disabled ? { disabled } : {})}>
      {buttonName}
    </Button>
  );
};

const ServiceWizard: React.FC<ServiceWizardProps> = ({
  wizardPattern,
  wizardSchema,
  wizardInitialValues,
  context,
  children,
  moduleCss,
}) => {
  const [isValidStep, setIsValidStep] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState(wizardPattern[0] || 0);
  const [currWizardPatternIndex, setCurrWizardPatternIndex] = useState(
    wizardPattern.findIndex((i) => i === activePageIndex)
  );
  const pages = React.Children.toArray(children);
  const currentPage = pages[activePageIndex];

  const goNextPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === wizardPattern.length - 1
        ? currWizardPatternIndex
        : currWizardPatternIndex + 1;
    setActivePageIndex(wizardPattern[wizardIndex]);
  }, [activePageIndex]);

  const goPrevPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === 0 ? 0 : currWizardPatternIndex - 1;
    setActivePageIndex(wizardPattern[wizardIndex]);
  }, [activePageIndex]);

  const handleSubmit = useCallback((values) => {
    console.log(values);
    // context.handleWizardChange(values);
  }, []);

  return (
    <div className={`${moduleCss}__wizard_container`}>
      <Button
        buttonStyle={EnumButtonStyle.Clear}
        className={`${moduleCss}__close`}
      >
        x close
      </Button>
      <div className={`${moduleCss}__content`}>
        <Formik
          initialValues={wizardInitialValues}
          onSubmit={handleSubmit}
          validateOnMount
          validate={(values: ResourceSettings) => {
            const errors: FormikErrors<ResourceSettings> =
              validate<ResourceSettings>(values, wizardSchema[activePageIndex]);
            console.log(
              Object.keys(errors).length,
              !!Object.keys(errors).length
            );
            setIsValidStep(!!Object.keys(errors).length);

            return errors;
          }}
          validateOnBlur
        >
          {({ errors, touched }) => {
            return (
              <Form>
                <FormikAutoSave debounceMS={1000} />
                {React.cloneElement(
                  currentPage as React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >,
                  {}
                )}
                <div>
                  {Object.keys(errors).length && Object.keys(touched).length
                    ? "no good"
                    : "fine"}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className={`${moduleCss}__footer`}>
        <div className={`${moduleCss}__backButton`}>
          <BackButton
            activePageIndex={activePageIndex}
            goPrevPage={goPrevPage}
          />
        </div>
        <WizardProgressBar />
        <div className={`${moduleCss}__continueBtn`}>
          <ContinueButton
            goNextPage={goNextPage}
            disabled={isValidStep}
            buttonName={"continue"}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceWizard;
