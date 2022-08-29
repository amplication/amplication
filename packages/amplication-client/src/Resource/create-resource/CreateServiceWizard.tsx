import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/design-system";
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { match, useHistory } from "react-router-dom";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import {
  CreateServiceWizardForm,
  serviceSettings,
} from "./CreateServiceWizardForm";
import * as models from "../../models";
import { createResource, serviceSettingsFieldsInitValues } from "../constants";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass }) => {
  const {
    currentProject,
    setNewResource,
    currentWorkspace,
    errorCreateResource,
    loadingCreateResource,
    addEntity,
  } = useContext(AppContext);

  const history = useHistory();

  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  );

  const errorMessage = formatError(errorCreateResource);

  const createStarterResource = useCallback(
    (data: models.ResourceCreateWithEntitiesInput, eventName: string) => {
      setNewResource(data, eventName, addEntity);
    },
    [setNewResource, addEntity]
  );

  const handleSubmitResource = (currentServiceSettings: serviceSettings) => {
    serviceSettingsFields.current = currentServiceSettings;
  };

  const handleBackToProjectClick = () => {
    history.push(`/${currentWorkspace?.id}/${currentProject?.id}/`);
  };

  const handleCreateServiceClick = () => {
    if (!serviceSettingsFields) return;
    const {
      generateAdminUI,
      generateGraphQL,
      generateRestApi,
    } = serviceSettingsFields.current;

    const isResourceWithEntities =
      serviceSettingsFields.current.resourceType === "sample";

    if (currentProject) {
      const resource = createResource(
        currentProject?.id,
        isResourceWithEntities,
        generateAdminUI,
        generateGraphQL,
        generateRestApi
      );

      createStarterResource(
        resource,
        isResourceWithEntities
          ? "createResourceFromSample"
          : "createResourceFromScratch"
      );
    }
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreateResource ? (
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
        <div className={`${moduleClass}__splitWrapper`}>
          <div className={`${moduleClass}__left`}>
            <div className={`${moduleClass}__description`}>
              <ResourceCircleBadge
                type={models.EnumResourceType.Service}
                size="large"
              />
              <div className={`${moduleClass}__description_top`}>
                <h2>
                  Amplication Service Creation Wizard Let’s start building your
                  service
                </h2>
              </div>
              <div className={`${moduleClass}__description_bottom`}>
                <h3>
                  Select which components to include in your service and whether
                  to use sample entities
                </h3>
              </div>
            </div>
          </div>
          <div className={`${moduleClass}__right`}>
            <CreateServiceWizardForm
              handleSubmitResource={handleSubmitResource}
            />
          </div>
        </div>
      )}
      <div className={`${moduleClass}__footer`}>
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            icon="arrow_left"
            iconPosition={EnumIconPosition.Left}
            onClick={handleBackToProjectClick}
          >
            {"Back to project"}
          </Button>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleCreateServiceClick}
          >
            <label>Create Service</label>
          </Button>
      </div>
      <Snackbar open={Boolean(errorCreateResource)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
