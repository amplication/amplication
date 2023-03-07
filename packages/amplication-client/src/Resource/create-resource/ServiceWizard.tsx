import React, {
  useState,
  ReactNode,
  useCallback,
  MutableRefObject,
} from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import WizardProgressBar from "./WizardProgressBar";
import { INITIAL_VALUES_WIZARD, ResourceSettings } from "./CreateServiceWizard";
import { Form, Formik } from "formik";
import FormikAutoSave from "../../util/formikAutoSave";

interface ServiceWizardProps {
  children: ReactNode;
  defineUser: "signup" | "login";
  moduleCss: string;
  wizardLen: number;
  submitWizard: () => void;
  handleWizardChange: (values: any) => void;
  resourceSettingsRef: MutableRefObject<ResourceSettings>;
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
  defineUser,
  children,
  moduleCss,
  wizardLen,
  handleWizardChange,
  submitWizard,
}) => {
  const [activePageIndex, setActivePageIndex] = useState(
    defineUser === "login" ? 1 : 0
  );

  const pages = React.Children.toArray(children);

  const currentPage = pages[activePageIndex];

  const goNextPage = useCallback(() => {
    setActivePageIndex(activePageIndex + 1);
  }, [activePageIndex]);

  const goPrevPage = useCallback(() => {
    setActivePageIndex(activePageIndex - 1);
  }, [activePageIndex]);

  const handleSubmit = useCallback((values) => {
    handleWizardChange(values);
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
        <Formik initialValues={INITIAL_VALUES_WIZARD} onSubmit={handleSubmit}>
          {(formik) => {
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
          {activePageIndex === 6 ? (
            <ContinueButton
              goNextPage={goNextPage}
              disabled={false}
              buttonName="Create service"
            />
          ) : (
            <ContinueButton
              goNextPage={goNextPage}
              disabled={false}
              buttonName="Continue"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceWizard;
