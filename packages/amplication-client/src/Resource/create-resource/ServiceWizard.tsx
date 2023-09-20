import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useRef,
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
import { GlobalHotKeys } from "react-hotkeys";

export type WizardStep = {
  index: number;
  hideFooter?: boolean;
  hideBackButton?: boolean;
  analyticsEventName: AnalyticsEventNames;
  stepName: string;
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

type BackButtonProps = {
  wizardPattern: number[];
  activePageIndex: number;
  hideBackButton?: boolean;
  goPrevPage: () => void;
};

const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(function (
  { hideBackButton, wizardPattern, activePageIndex, goPrevPage },
  ref
) {
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
      <button
        className="amp-button amp-button--outline"
        onClick={handleClick}
        ref={ref}
      >
        Back
      </button>
    );
  }
  return null;
});

type ContinueButtonProps = {
  goNextPage: () => void;
  disabled: boolean;
  buttonName: string;
};

const ContinueButton = forwardRef<HTMLButtonElement, ContinueButtonProps>(
  function ({ disabled, buttonName, goNextPage }, ref) {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      goNextPage();
      event.currentTarget.blur();
    };
    return (
      <button
        className="amp-button amp-button--primary"
        onClick={handleClick}
        {...(disabled ? { disabled } : {})}
        ref={ref}
      >
        {buttonName}
      </button>
    );
  }
);

const MIN_TIME_OUT_LOADER = 2000;

export const keyMap = {
  GO_TO_NEXT_PAGE: ["enter", "right"],
  GO_TO_PREV_PAGE: ["left"],
};

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

  const goNextPageButtonRef = useRef<HTMLButtonElement>(null);
  const goPrevPageButtonRef = useRef<HTMLButtonElement>(null);

  const handleNextKeyDown = useCallback(() => {
    goNextPageButtonRef?.current?.click();
  }, [goNextPageButtonRef]);

  const handlePrevKeyDown = useCallback(() => {
    goPrevPageButtonRef?.current?.click();
  }, [goNextPageButtonRef]);

  const handlers = {
    GO_TO_NEXT_PAGE: handleNextKeyDown,
    GO_TO_PREV_PAGE: handlePrevKeyDown,
  };

  return (
    <div className={`${moduleCss}__wizard_container`}>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      {defineUser === "Create Service" && (
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          className={`${moduleCss}__close`}
          onClick={() =>
            handleCloseWizard(wizardSteps[currWizardPatternIndex]?.stepName)
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
                <Form>
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
                        ref={goPrevPageButtonRef}
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
                          ref={goNextPageButtonRef}
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
