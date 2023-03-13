import React, { useState, ReactNode, useCallback } from "react";
import * as analytics from "../../util/analytics";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import WizardProgressBar from "./WizardProgressBar";
import { ResourceSettings } from "./wizard-pages/interfaces";
import { Form, Formik, FormikErrors, FormikProps } from "formik";
import { validate } from "../../util/formikValidateJsonSchema";
import {
  Redirect,
  useRouteMatch,
  useHistory,
  Route,
  Switch,
} from "react-router-dom";

interface ServiceWizardProps {
  children: ReactNode;
  wizardBaseRoute: string;
  wizardPattern: number[];
  wizardSchema: { [key: string]: any };
  wizardInitialValues: { [key: string]: any };
  wizardSubmit: (values: ResourceSettings) => void;
  moduleCss: string;
}

const BackButton: React.FC<{
  wizardPattern: number[];
  activePageIndex: number;
  goPrevPage: () => void;
}> = ({ wizardPattern, activePageIndex, goPrevPage }) =>
  activePageIndex !== wizardPattern[0] ? (
    <Button onClick={goPrevPage}>back</Button>
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

const setWizardRoutes = (
  pages: (
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactPortal
  )[],
  formik: FormikProps<{ [key: string]: any }>
) =>
  pages.map((page) => (
    <Route
      path={page.props.path}
      exact={true}
      render={(props) => {
        const { match } = props;
        pageTracking(match.path, match.url, match.params);

        return React.cloneElement(
          page as React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
          >,
          { formik }
        );
      }}
    />
  ));

const ServiceWizard: React.FC<ServiceWizardProps> = ({
  wizardBaseRoute,
  wizardPattern,
  wizardSchema,
  wizardInitialValues,
  wizardSubmit,
  children,
  moduleCss,
}) => {
  const history = useHistory();
  const matchCreateResource = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/create-resource"
  );
  const [isValidStep, setIsValidStep] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState(wizardPattern[0] || 0);
  const currWizardPatternIndex = wizardPattern.findIndex(
    (i) => i === activePageIndex
  );

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
    history.push(
      `${wizardBaseRoute}/${pages[wizardPattern[wizardIndex]].props.step}`
    );
  }, [activePageIndex, history]);

  const goPrevPage = useCallback(() => {
    const wizardIndex =
      currWizardPatternIndex === 0 ? 0 : currWizardPatternIndex - 1;
    setActivePageIndex(wizardPattern[wizardIndex]);
    history.push(
      `${wizardBaseRoute}/${pages[wizardPattern[wizardIndex]].props.step}`
    );
  }, [activePageIndex, history]);

  return (
    <>
      {matchCreateResource.isExact && (
        <Redirect
          from={wizardBaseRoute}
          to={`${wizardBaseRoute}/${currentPage.props.step}`}
        />
      )}
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
                validate<ResourceSettings>(
                  values,
                  wizardSchema[activePageIndex]
                );

              setIsValidStep(!!Object.keys(errors).length);

              return errors;
            }}
            validateOnBlur
          >
            {(formik) => {
              return (
                <Form>
                  <Switch>{setWizardRoutes(pages, formik)}</Switch>
                  {/* {React.cloneElement(
                    currentPage as React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >,
                    { formik }
                  )} */}
                </Form>
              );
            }}
          </Formik>
        </div>
        <div className={`${moduleCss}__footer`}>
          <div className={`${moduleCss}__backButton`}>
            <BackButton
              wizardPattern={wizardPattern}
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
    </>
  );
};

export default ServiceWizard;
