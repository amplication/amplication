import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/ui/design-system";
import React, { useCallback, useContext, useState } from "react";
import { match, useHistory } from "react-router-dom";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { formatError } from "../../util/error";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import { prepareComponentObject } from "../constants";
import "./CreateComponent.scss";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateComponentWizard: React.FC<Props> = ({ moduleClass }) => {
  const {
    currentProject,
    createComponent,
    errorCreateComponent,
    loadingCreateComponent,
  } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const history = useHistory();
  const { trackEvent } = useTracking();

  const errorMessage = formatError(errorCreateComponent);
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);

  const createResource = useCallback(
    (data: models.ResourceCreateInput) => {
      createComponent(data);
    },
    [createComponent]
  );

  const handleBackToProjectClick = () => {
    trackEvent({ eventName: AnalyticsEventNames.BackToProjectsClick });
    history.push(`${baseUrl}/`);
  };

  const handleCreateServiceClick = () => {
    if (currentProject) {
      setIsCreatingComponent(true);
      const resource = prepareComponentObject(currentProject.id);
      createResource(resource);
    }
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreateComponent || isCreatingComponent ? (
        <div className={`${moduleClass}__processing`}>
          <div
            className={`${moduleClass}__processing__message_title_container`}
          >
            <div className={`${moduleClass}__processing__title`}>All set!</div>
            <div className={`${moduleClass}__processing__message`}>
              It should only take a few seconds to finish. Don't go away!
            </div>
          </div>
          <SvgThemeImage image={EnumImages.CreateServiceWizard} />
        </div>
      ) : (
        <div className={`${moduleClass}__wrapper`}>
          <div className={`${moduleClass}__description`}>
            <ResourceCircleBadge
              type={models.EnumResourceType.Component}
              size="large"
            />
            <div className={`${moduleClass}__description_top`}>
              <h2>Add a component to the catalog</h2>
            </div>
            <div className={`${moduleClass}__description_bottom`}>
              <h3>Add a new or existing software component to the catalog</h3>
            </div>
          </div>
        </div>
      )}
      <div className={`${moduleClass}__footer`}>
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          icon="arrow_left"
          iconPosition={EnumIconPosition.Left}
          onClick={handleBackToProjectClick}
        >
          {"Back to project"}
        </Button>
        <Button
          buttonStyle={EnumButtonStyle.Primary}
          onClick={handleCreateServiceClick}
          disabled={isCreatingComponent}
        >
          <label>Add a new component</label>
        </Button>
      </div>
      <Snackbar open={Boolean(errorCreateComponent)} message={errorMessage} />
    </Modal>
  );
};

export default CreateComponentWizard;
