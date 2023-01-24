import { Loader } from "@amplication/design-system";
import React, { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import "./CreateServiceWizard.scss";
import * as models from "../../models";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { AppContext } from "../../context/appContext";

// eslint-disable-next-line @typescript-eslint/ban-types
const CreateServiceWelcome: React.FC<{}> = () => {
  const {
    currentProject,
    setNewService,
    currentWorkspace,
    errorCreateService,
    loadingCreateService,
  } = useContext(AppContext);

  const CLASS_NAME = "create-service-wizard";

  const welcomeMatch = useRouteMatch({
    path: `/${currentWorkspace?.id}/${currentProject?.id}/create-resource`,
    strict: true,
  });

  return welcomeMatch.isExact ? (
    <div>
      {loadingCreateService ? (
        <div className={`${CLASS_NAME}__processing`}>
          <div className={`${CLASS_NAME}__processing__message_title_container`}>
            <div className={`${CLASS_NAME}__processing__title`}>
              All set! We’re currently generating your service.
            </div>
            <div className={`${CLASS_NAME}__processing__message`}>
              It should only take a few seconds to finish. Don't go away!
            </div>
          </div>
          <div className={`${CLASS_NAME}__processing__loader`}>
            <Loader fullScreen={false} />
          </div>

          <div className={`${CLASS_NAME}__processing__tagline`}>
            <div>For a full experience, connect with a GitHub repository</div>
            <div>
              and get a new Pull Request every time you make changes in your
              data model.
            </div>
          </div>
        </div>
      ) : (
        <div className={`${CLASS_NAME}__left`}>
          <div className={`${CLASS_NAME}__description`}>
            <ResourceCircleBadge
              type={models.EnumResourceType.Service}
              size="large"
            />
            <div className={`${CLASS_NAME}__description_top`}>
              <h2>
                Amplication Service Creation Wizard Let’s start building your
                service
              </h2>
            </div>
            <div className={`${CLASS_NAME}__description_bottom`}>
              <h3>
                Select which components to include in your service and whether
                to use sample entities
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default CreateServiceWelcome;
