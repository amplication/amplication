import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { ResourceSettings } from "./wizard-pages/interfaces";
import { Form, Formik, FormikErrors } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import { WizardProgressBarInterface } from "./wizardResourceSchema";
import WizardProgressBar from "./WizardProgressBar";
import CreateServiceLoader from "./CreateServiceLoader";
import { DefineUser } from "./CreateServiceWizard";

export type WizardStep = {
  index: number;
  hideFooter?: boolean;
  hideBackButton?: boolean;
};

interface ServiceWizardProps {
  children: ReactNode;
  defineUser: DefineUser;
  wizardSteps: WizardStep[];
  wizardSchema: { [key: string]: any };
  wizardProgressBar: WizardProgressBarInterface[];
  wizardInitialValues: { [key: string]: any };
  wizardSubmit: (activeIndex: number, values: ResourceSettings) => void;
  moduleCss: string;
  submitFormPage: number;
  submitLoader: boolean;
  handleCloseWizard: (currentPage: string) => void;
  handleWizardProgress: (dir: "next" | "prev", page: string) => void;
}

const BackButton: React.FC<{
  wizardPattern: number[];
  activePageIndex: number;
  hideBackButton?: boolean;
  goPrevPage: () => void;
}> = ({ hideBackButton, wizardPattern, activePageIndex, goPrevPage }) =>
  !hideBackButton &&
  activePageIndex !== wizardPattern[0] &&
  activePageIndex !== wizardPattern[wizardPattern.length - 1] ? (
    <Button buttonStyle={EnumButtonStyle.Outline} onClick={goPrevPage}>
      back
    </Button>
  ) : null;

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

const MIN_TIME_OUT_LOADER = 2000;

const ServiceWizard: React.FC<ServiceWizardProps> = ({
  wizardSteps,
  wizardSchema,
  wizardProgressBar,
  wizardInitialValues,
  wizardSubmit,
  children,
  moduleCss,
  submitFormPage,
  submitLoader,
  handleCloseWizard,
  handleWizardProgress,
  defineUser,
}) => {
  const wizardPattern = useMemo(() => {
    return wizardSteps.map((step) => step.index);
  }, [wizardSteps]);

  const [isValidStep, setIsValidStep] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState(wizardPattern[0] || 0);
  const currWizardPatternIndex = wizardPattern.findIndex(
    (i) => i === activePageIndex
  );

  const currentStep = useMemo(() => {
    return wizardSteps.find((step) => step.index === activePageIndex);
  }, [wizardSteps, activePageIndex]);

  const pages = React.Children.toArray(children) as (
    | React.ReactElement<any, React.JSXElementConstructor<any>>
    | React.ReactPortal
  )[];

  const currentPage = pages[activePageIndex];
  const goNextPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === wizardPattern.length - 1
        ? currWizardPatternIndex
        : currWizardPatternIndex + 1;

    handleWizardProgress(
      "next",
      (
        pages[wizardPattern[wizardIndex]]
          .type as React.JSXElementConstructor<any>
      ).name
    );
    setActivePageIndex(wizardPattern[wizardIndex]);
  }, [activePageIndex]);

  const goPrevPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === 0 ? 0 : currWizardPatternIndex - 1;
    handleWizardProgress(
      "prev",
      (
        pages[wizardPattern[wizardIndex]]
          .type as React.JSXElementConstructor<any>
      ).name
    );
    setActivePageIndex(wizardPattern[wizardIndex]);
  }, [activePageIndex]);

  const [keepLoadingAnimation, setKeepLoadingAnimation] =
    useState<boolean>(false);

  useEffect(() => {
    if (!submitLoader) return;

    setKeepLoadingAnimation(true);
  }, [submitLoader]);

  useEffect(() => {
    if (!keepLoadingAnimation) return;

    const timer = setTimeout(() => {
      setKeepLoadingAnimation(false);
    }, MIN_TIME_OUT_LOADER);

    return () => clearTimeout(timer);
  }, [keepLoadingAnimation]);

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  return (
    <div className={`${moduleCss}__wizard_container`}>
      {defineUser === "Create Service" && (
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          className={`${moduleCss}__close`}
          onClick={() =>
            handleCloseWizard(
              (currentPage.type as React.JSXElementConstructor<any>).name
            )
          }
        >
          x close
        </Button>
      )}
      <div className={`${moduleCss}__content`}>
        <Formik
          initialValues={wizardInitialValues}
          onSubmit={(values: ResourceSettings) => {
            wizardSubmit(activePageIndex, values);
          }}
          validateOnMount
          validate={(values: ResourceSettings) => {
            if (activePageIndex === 3 && values.structureType !== "Mono") {
              setIsValidStep(false);
              return;
            }
            if (values.serviceName?.trim() === "") {
              setIsValidStep(true);
              return;
            }
            if (
              activePageIndex === 1 &&
              !values.isOverrideGitRepository &&
              defineUser === "Create Service"
            ) {
              setIsValidStep(false);
              return;
            }

            const errors: FormikErrors<ResourceSettings> =
              validate<ResourceSettings>(values, wizardSchema[activePageIndex]);
            setIsValidStep(!!Object.keys(errors).length);

            return errors;
          }}
          validateOnBlur
        >
          {(formik) => {
            return (
              <>
                <Form onKeyDown={onKeyDown}>
                  {keepLoadingAnimation ? (
                    <CreateServiceLoader />
                  ) : (
                    React.cloneElement(
                      currentPage as React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >,

                      { formik, goNextPage }
                    )
                  )}
                </Form>
                {!currentStep.hideFooter && (
                  <div className={`${moduleCss}__footer`}>
                    <div className={`${moduleCss}__backButton`}>
                      <BackButton
                        hideBackButton={currentStep.hideBackButton}
                        wizardPattern={wizardPattern}
                        activePageIndex={activePageIndex}
                        goPrevPage={goPrevPage}
                      />
                    </div>
                    <WizardProgressBar
                      lastPage={wizardPattern[wizardPattern.length - 1]}
                      activePageIndex={activePageIndex}
                      wizardProgressBar={wizardProgressBar}
                    />
                    <div className={`${moduleCss}__continueBtn`}>
                      {activePageIndex !==
                        wizardPattern[wizardPattern.length - 1] && (
                        <ContinueButton
                          goNextPage={
                            activePageIndex === submitFormPage
                              ? () => {
                                  formik.submitForm();
                                  goNextPage();
                                }
                              : goNextPage
                          }
                          disabled={isValidStep}
                          buttonName={
                            activePageIndex === submitFormPage
                              ? "create service"
                              : "continue"
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceWizard;
