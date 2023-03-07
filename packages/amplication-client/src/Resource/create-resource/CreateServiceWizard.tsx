import { Button, Modal, Snackbar } from "@amplication/design-system";
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { match } from "react-router-dom";
import * as H from "history";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";
import CreateServiceWelcome from "./wizard-pages/CreateServiceWelcome";
import ServiceWizard from "./ServiceWizard";
import CreateServiceName from "./wizard-pages/CreateServiceName";
import CreateGithubSync from "./wizard-pages/CreateGithubSync";
import CreateGenerationSettings from "./wizard-pages/CreateGenerationSettings";
import CreateServiceRepository from "./wizard-pages/CreateServiceRepository";
import CreateServiceDatabase from "./wizard-pages/CreateServiceDatabase";
import CreateServiceAuth from "./wizard-pages/CreateServiceAuth";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

export interface ResourceSettings {
  serviceName: string;
}

export const INITIAL_VALUES_WIZARD = {
  serviceName: "",
  generateAdminUI: false,
  generateGraphQL: false,
  generateRestApi: false,
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass, ...props }) => {
  const { errorCreateService } = useContext(AppContext);
  // const [validate];
  const defineUser = (props.location.state as "signup" | "login") || "login";
  const resourceSettingsRef: MutableRefObject<ResourceSettings> = useRef();

  const onWizardChangeCb = useCallback((values) => {
    // assign new values to ref
    // validation to continue button

    const { serviceName, generateAdminUI, generateGraphQL, generateRestApi } =
      values;
    console.log({
      serviceName,
      generateAdminUI,
      generateGraphQL,
      generateRestApi,
    });
  }, []);

  const errorMessage = formatError(errorCreateService);

  const createResource = useCallback(() => {
    // at the end of the process this function will trigger create service
  }, []);

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        defineUser={defineUser}
        moduleCss={moduleClass}
        submitWizard={createResource}
        handleWizardChange={onWizardChangeCb}
        resourceSettingsRef={resourceSettingsRef}
        wizardLen={8}
      >
        <CreateServiceWelcome moduleCss={moduleClass} />
        <CreateServiceName moduleCss={moduleClass} />
        <CreateGithubSync moduleClass={moduleClass} />
        <CreateGenerationSettings moduleClass={moduleClass} />
        <CreateServiceRepository moduleClass={moduleClass} />
        <CreateServiceDatabase moduleClass={moduleClass} />
        <CreateServiceAuth moduleClass={moduleClass} />
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
