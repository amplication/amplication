import React from "react";
import "./CreateServiceWizard.scss";
import { WizardProgressBarInterface } from "./wizardResourceSchema";
import { Icon } from "@amplication/ui/design-system";
import "./wizardProgressBar.scss";

interface Props {
  lastPage: number;
  wizardProgressBar: WizardProgressBarInterface[];
  activePageIndex: number;
}

const CLASS_NAME = "wizard-progress-bar";

const ProgressBarItem: React.FC<{
  title: string;
  isValid: boolean;
  disabled: boolean;
}> = ({ title, isValid, disabled }) => (
  <div className={`${CLASS_NAME}__item`}>
    <div className={`${CLASS_NAME}__item_container`}>
      <div className={`${CLASS_NAME}__item_icon`}>
        {isValid ? (
          <Icon
            icon="check"
            className={`${
              disabled ? `${CLASS_NAME}__disabled` : ""
            } wizard_check`}
          />
        ) : (
          <Icon
            icon="circle"
            className={`${
              disabled ? `${CLASS_NAME}__disabled` : ""
            } wizard_loading`}
          />
        )}
      </div>
      <div
        className={`${
          disabled ? `${CLASS_NAME}__disabled` : ""
        } ${CLASS_NAME}__item_title`}
      >
        {title}
      </div>
    </div>
  </div>
);

const WizardProgressBar: React.FC<Props> = ({
  lastPage,
  wizardProgressBar,
  activePageIndex,
}) => {
  return (
    <div className={`${CLASS_NAME}__container`}>
      {wizardProgressBar.map((item: WizardProgressBarInterface, index) => {
        const enabledPage = item.activePages.some(
          (page: number) => page <= activePageIndex
        );

        const validPage = item.activePages.every(
          (page: number) => page < activePageIndex
        );

        return (
          <ProgressBarItem
            key={`${item.title}_item`}
            title={item.title}
            isValid={validPage || activePageIndex === lastPage}
            disabled={!enabledPage}
          />
        );
      })}
    </div>
  );
};

export default WizardProgressBar;
