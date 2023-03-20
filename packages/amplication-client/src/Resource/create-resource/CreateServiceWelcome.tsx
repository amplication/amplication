import React, { useCallback, useContext } from "react";
import "./CreateServiceWelcome.scss";
import { Button, Modal } from "@amplication/design-system";
import { WizardStepProps } from "./wizard-pages/interfaces";
import { AppContext } from "../../context/appContext";
import { useHistory } from "react-router-dom";

const CreateServiceWelcome: React.FC<WizardStepProps> = ({ moduleClass }) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const history = useHistory();

  const handleStart = useCallback(() => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/create-resource`
    );
  }, [history]);

  return (
    <Modal open fullScreen css={moduleClass}>
      <div className={moduleClass}>
        <h2>
          Welcome to amplication!{" "}
          <span role="img" aria-label="party emoji">
            🎉
          </span>
        </h2>
        <h3>Let’s create together your first service</h3>
        <div className={`${moduleClass}__start_btn`}>
          <Button onClick={handleStart}>Let's start</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateServiceWelcome;
