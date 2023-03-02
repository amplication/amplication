import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import "./CreateServiceWelcome.scss";
import { AppContext } from "../../context/appContext";
import { Button } from "@amplication/design-system";

const CreateServiceWelcome: React.FC<{ moduleCss: string }> = ({
  moduleCss,
}) => {
  const { currentProject, currentWorkspace } = useContext(AppContext);

  const CLASS_NAME = "create-service-welcome";

  const welcomeMatch = useRouteMatch({
    path: `/${currentWorkspace?.id}/${currentProject?.id}/create-resource`,
    strict: true,
  });

  const history = useHistory();

  const handleStartBtnClick = () => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/create-resource/details/service-name`
    );
  };

  return welcomeMatch.isExact ? (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__welcome`}>
        <h2>
          Welcome to amplication!{" "}
          <span role="img" aria-label="party emoji">
            🎉
          </span>
        </h2>
        <h3>Let’s create together your first service</h3>
        <div className={`${CLASS_NAME}__start_btn`}>
          <Button onClick={handleStartBtnClick}>Let's start</Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CreateServiceWelcome;
