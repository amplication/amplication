import React, {
  useState,
  ReactNode,
  useCallback,
  MutableRefObject,
} from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import WizardProgressBar from "./WizardProgressBar";
import { ResourceSettings } from "./CreateServiceWizard";

interface ServiceWizardProps {
  children: ReactNode;
  defineUser: "signup" | "login";
  moduleCss: string;
  wizardLen: number;
  submitWizard: () => void;
  handleWizardChange: () => void;
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
    //const prevPage = pages[activePageIndex - 1] as React.ReactElement;

    //console.log(prevPage.key); todo: convert by key value component name and route to the correct page
  }, [activePageIndex]);

  return (
    <div className={`${moduleCss}__wizard_container`}>
      <Button
        buttonStyle={EnumButtonStyle.Clear}
        className={`${moduleCss}__close`}
      >
        x close
      </Button>
      <div className={`${moduleCss}__content`}>
        {React.cloneElement(
          currentPage as React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
          >,
          {}
        )}
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
