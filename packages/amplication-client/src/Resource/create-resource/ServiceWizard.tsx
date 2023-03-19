import React, { useState, ReactNode, useCallback, useEffect } from "react";
import * as analytics from "../../util/analytics";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import { ResourceSettings } from "./wizard-pages/interfaces";
import { Form, Formik, FormikErrors } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import { WizardProgressBarInterface } from "./wizardResourceSchema";
import WizardProgressBar from "./WizardProgressBar";
import CreateServiceLoader from "./CreateServiceLoader";
// import { useRouteMatch } from "react-router-dom";

interface ServiceWizardProps {
  children: ReactNode;
  wizardPattern: number[];
  wizardSchema: { [key: string]: any };
  wizardProgressBar: WizardProgressBarInterface[];
  wizardInitialValues: { [key: string]: any };
  wizardSubmit: (values: ResourceSettings) => void;
  moduleCss: string;
  submitFormPage: number;
  goToPage: number | null;
  submitLoader: boolean;
}

const BackButton: React.FC<{
  wizardPattern: number[];
  activePageIndex: number;
  goPrevPage: () => void;
}> = ({ wizardPattern, activePageIndex, goPrevPage }) =>
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

const pageTracking = (path: string, url: string, params: any) => {
  analytics.page(path.replaceAll("/", "-"), {
    path,
    url,
    params: params,
  });
};

const ServiceWizard: React.FC<ServiceWizardProps> = ({
  wizardPattern,
  wizardSchema,
  wizardProgressBar,
  wizardInitialValues,
  wizardSubmit,
  children,
  moduleCss,
  submitFormPage,
  goToPage,
  submitLoader,
}) => {
  const [isValidStep, setIsValidStep] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState(wizardPattern[0] || 0);
  const currWizardPatternIndex = wizardPattern.findIndex(
    (i) => i === activePageIndex
  );

  useEffect(() => {
    if (!goToPage) return;

    setActivePageIndex(goToPage);
  }, [goToPage]);

  const pages = React.Children.toArray(children) as (
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactPortal
  )[];

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

  const [keepLoadingAnimation, setKeepLoadingAnimation] =
    useState<boolean>(true);

  const handleTimeout = useCallback(() => {
    setKeepLoadingAnimation(false);
  }, []);

  const showLoadingAnimation = keepLoadingAnimation || submitLoader;

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
          onSubmit={wizardSubmit}
          validateOnMount
          validate={(values: ResourceSettings) => {
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
                <Form>
                  {submitLoader ? (
                    <CreateServiceLoader handleTimeout={handleTimeout} />
                  ) : (
                    React.cloneElement(
                      currentPage as React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >,

                      { formik }
                    )
                  )}
                </Form>
                <div className={`${moduleCss}__footer`}>
                  <div className={`${moduleCss}__backButton`}>
                    <BackButton
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
                            ? formik.submitForm
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
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceWizard;
