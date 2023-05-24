import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Button, EnumButtonStyle, Icon } from "@amplication/ui/design-system";
import { ResourceSettings } from "./wizard-pages/interfaces";
import { Form, Formik, FormikErrors } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import { WizardProgressBarInterface } from "./wizardResourceSchema";
import WizardProgressBar from "./WizardProgressBar";
import CreateServiceLoader from "./CreateServiceLoader";
import { DefineUser } from "./CreateServiceWizard";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useTracking } from "../../util/analytics";

export type WizardStep = {
  index: number;
  hideFooter?: boolean;
  hideBackButton?: boolean;
  analyticsEventName: AnalyticsEventNames;
  stepName?: string;
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
  handleWizardProgress: (
    eventName:
      | AnalyticsEventNames.ServiceWizardStep_ContinueClicked
      | AnalyticsEventNames.ServiceWizardStep_BackClicked,
    page: string,
    pageEventName: AnalyticsEventNames
  ) => void;
}

const BackButton: React.FC<{
  wizardPattern: number[];
  activePageIndex: number;
  hideBackButton?: boolean;
  goPrevPage: () => void;
}> = ({ hideBackButton, wizardPattern, activePageIndex, goPrevPage }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    goPrevPage();
    event.currentTarget.blur();
  };
  if (
    !hideBackButton &&
    activePageIndex !== wizardPattern[0] &&
    activePageIndex !== wizardPattern[wizardPattern.length - 1]
  ) {
    return (
      <Button buttonStyle={EnumButtonStyle.Outline} onClick={handleClick}>
        Back
      </Button>
    );
  }
  return null;
};

const ContinueButton: React.FC<{
  goNextPage: () => void;
  disabled: boolean;
  buttonName: string;
}> = ({ goNextPage, disabled, buttonName }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    goNextPage();
    event.currentTarget.blur();
  };
  return (
    <Button onClick={handleClick} {...(disabled ? { disabled } : {})}>
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
  const { trackEvent } = useTracking();
  const wizardPattern = useMemo(() => {
    return wizardSteps.map((step) => step.index);
  }, [wizardSteps]);

  const [isInvalidStep, setIsInvalidStep] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState(wizardPattern[0] || 0);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const currWizardPatternIndex = wizardPattern.findIndex(
    (i) => i === activePageIndex
  );

  const handleSubmit = useCallback(
    (activeIndex: number, values: ResourceSettings) => {
      setFormSubmitted(true);
      wizardSubmit(activeIndex, values);
    },
    [setFormSubmitted, wizardSubmit]
  );

  const currentStep = useMemo(() => {
    return wizardSteps.find((step) => step.index === activePageIndex);
  }, [wizardSteps, activePageIndex]);

  const pages = React.Children.toArray(children) as (
    | React.ReactElement<any, React.JSXElementConstructor<any>>
    | React.ReactPortal
  )[];

  const currentPage = pages[activePageIndex];

  useEffect(() => {
    trackEvent({
      eventName: wizardSteps[currWizardPatternIndex].analyticsEventName,
      category: "Service Wizard",
      WizardType: defineUser,
    });
  }, []);

  const goNextPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === wizardPattern.length - 1
        ? currWizardPatternIndex
        : currWizardPatternIndex + 1;

    const nextIndex = wizardPattern[wizardIndex];
    const newStep = wizardSteps.find((step) => step.index === nextIndex);

    handleWizardProgress(
      AnalyticsEventNames.ServiceWizardStep_ContinueClicked,
      wizardSteps[currWizardPatternIndex].stepName,
      newStep.analyticsEventName
    );
    setActivePageIndex(nextIndex);
  }, [activePageIndex]);

  const goPrevPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === 0 ? 0 : currWizardPatternIndex - 1;

    const prevIndex = wizardPattern[wizardIndex];
    const newStep = wizardSteps.find((step) => step.index === prevIndex);

    handleWizardProgress(
      AnalyticsEventNames.ServiceWizardStep_BackClicked,
      wizardSteps[currWizardPatternIndex].stepName,
      newStep.analyticsEventName
    );
    setActivePageIndex(prevIndex);
  }, [activePageIndex]);

  const [keepLoadingAnimation, setKeepLoadingAnimation] =
    useState<boolean>(false);

  useEffect(() => {
    if (formSubmitted && !submitLoader) {
      setFormSubmitted(false);
      goNextPage();
    }

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
          <Icon icon="close" size="xsmall"></Icon>
          Close
        </Button>
      )}
      <div className={`${moduleCss}__content`}>
        <Formik
          initialValues={wizardInitialValues}
          onSubmit={(values: ResourceSettings) => {
            handleSubmit(activePageIndex, values);
          }}
          validateOnMount
          validate={(values: ResourceSettings) => {
            if (values.serviceName?.trim() === "") {
              setIsInvalidStep(true);
              return;
            }
            if (
              activePageIndex === 2 &&
              !values.isOverrideGitRepository &&
              defineUser === "Create Service"
            ) {
              setIsInvalidStep(false);
              return;
            }

            const errors: FormikErrors<ResourceSettings> =
              validate<ResourceSettings>(values, wizardSchema[activePageIndex]);
            setIsInvalidStep(!!Object.keys(errors).length);

            return errors;
          }}
          validateOnBlur
        >
          {(formik) => {
            return (
              <>
                <Form onKeyDown={onKeyDown}>
                  {keepLoadingAnimation || submitLoader ? (
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
                                }
                              : goNextPage
                          }
                          disabled={isInvalidStep}
                          buttonName={"Continue"}
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
