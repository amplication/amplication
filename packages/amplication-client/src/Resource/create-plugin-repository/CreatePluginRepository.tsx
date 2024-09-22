import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/ui/design-system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { match, useHistory } from "react-router-dom";
import { useTracking } from "../../util/analytics";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { formatError } from "../../util/error";
import { preparePluginRepositoryObject } from "../constants";
import "./CreatePluginRepository.scss";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreatePluginRepositoryWizard: React.FC<Props> = ({ moduleClass }) => {
  const {
    currentProject,
    createPluginRepository,
    currentWorkspace,
    errorCreatePluginRepository,
    loadingCreatePluginRepository,
  } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const history = useHistory();
  const { trackEvent } = useTracking();

  const errorMessage = formatError(errorCreatePluginRepository);
  const [isCreatingPluginRepository, setIsCreatingPluginRepository] =
    useState(false);

  useEffect(() => {
    if (!errorCreatePluginRepository) {
      return;
    }

    trackEvent({ eventName: AnalyticsEventNames.PluginRepositoryErrorCreate });
  }, [errorCreatePluginRepository, trackEvent]);

  const createResource = useCallback(
    (data: models.ResourceCreateInput) => {
      createPluginRepository(data);
    },
    [createPluginRepository]
  );

  const handleBackToProjectClick = () => {
    trackEvent({ eventName: AnalyticsEventNames.BackToProjectsClick });
    history.push(`${baseUrl}/`);
  };

  const handleCreateServiceClick = () => {
    if (currentProject) {
      setIsCreatingPluginRepository(true);
      const resource = preparePluginRepositoryObject(currentProject.id);
      createResource(resource);
    }
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreatePluginRepository || isCreatingPluginRepository ? (
        <div className={`${moduleClass}__processing`}>
          <div
            className={`${moduleClass}__processing__message_title_container`}
          >
            <div className={`${moduleClass}__processing__title`}>
              All set! We’re currently generating your service.
            </div>
            <div className={`${moduleClass}__processing__message`}>
              It should only take a few seconds to finish. Don't go away!
            </div>
          </div>
          <SvgThemeImage image={EnumImages.CreateServiceWizard} />
          <div className={`${moduleClass}__processing__tagline`}>
            <div>For a full experience, connect with a GitHub repository</div>
            <div>
              and get a new Pull Request every time you make changes in your
              data model.
            </div>
          </div>
        </div>
      ) : (
        <div className={`${moduleClass}__wrapper`}>
          <div className={`${moduleClass}__description`}>
            <ResourceCircleBadge
              type={models.EnumResourceType.PluginRepository}
              size="large"
            />
            <div className={`${moduleClass}__description_top`}>
              <h2>Create a Plugin Repository</h2>
            </div>
            <div className={`${moduleClass}__description_bottom`}>
              <h3>Create a plugin repository to upload and manage plugins.</h3>
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
          disabled={isCreatingPluginRepository}
        >
          <label>Create Plugin Repository</label>
        </Button>
      </div>
      <Snackbar
        open={Boolean(errorCreatePluginRepository)}
        message={errorMessage}
      />
    </Modal>
  );
};

export default CreatePluginRepositoryWizard;
