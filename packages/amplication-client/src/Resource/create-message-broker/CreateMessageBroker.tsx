import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/design-system";
import React, { useCallback, useContext } from "react";
import { match, useHistory } from "react-router-dom";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { formatError } from "../../util/error";
import { prepareMessageBrokerObject } from "../constants";
import { CreateMessageBrokerForm } from "./CreateMessageBrokerForm";
import "./CreateMessageBroker.scss";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateMessageBrokerWizard: React.FC<Props> = ({ moduleClass }) => {
  const {
    currentProject,
    createMessageBroker,
    currentWorkspace,
    errorCreateMessageBroker,
    loadingCreateMessageBroker,
  } = useContext(AppContext);

  const history = useHistory();

  const errorMessage = formatError(errorCreateMessageBroker);

  const createStarterResource = useCallback(
    (data: models.ResourceCreateInput, eventName: string) => {
      createMessageBroker(data, eventName);
    },
    [createMessageBroker]
  );

  const handleBackToProjectClick = () => {
    history.push(`/${currentWorkspace?.id}/${currentProject?.id}/`);
  };

  const handleCreateServiceClick = () => {
    if (currentProject) {
      const resource = prepareMessageBrokerObject(currentProject.id);
      createStarterResource(resource, "createMessageBroker");
    }
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreateMessageBroker ? (
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
                type={models.EnumResourceType.MessageBroker}
                size="large"
              />
              <div className={`${moduleClass}__description_top`}>
                <h2>Broker Creation Wizard</h2>
              </div>
              <div className={`${moduleClass}__description_bottom`}>
                <h3>
                  Create a message broker to communicate between services with
                  messages and events
                </h3>
              </div>
            </div>
          </div>
          <div className={`${moduleClass}__right`}>
            <CreateMessageBrokerForm handleSubmitResource={() => {}} />
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
      <Snackbar
        open={Boolean(errorCreateMessageBroker)}
        message={errorMessage}
      />
    </Modal>
  );
};

export default CreateMessageBrokerWizard;
