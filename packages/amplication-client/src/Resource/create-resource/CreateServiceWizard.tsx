import { Button, Modal, Snackbar } from "@amplication/design-system";
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
  useState,
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
import { schemaArray, ResourceInitialValues } from "./wizardResourceSchema";
import { ResourceSettings } from "./wizard-pages/interfaces";
import CreateServiceCodeGeneration from "./wizard-pages/CreateServiceCodeGeneration";
import { CreateServiceNextSteps } from "./wizard-pages/CreateServiceNextSteps";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

const CreateServiceWizard: React.FC<Props> = ({
  moduleClass,
  innerRoutes,
  ...props
}) => {
  const { errorCreateService, currentWorkspace, currentProject } =
    useContext(AppContext);
  const defineUser = (props.location.state as "signup" | "login") || "login";

  const errorMessage = formatError(errorCreateService);

  const createResource = useCallback((values: ResourceSettings) => {
    // at the end of the process this function will trigger create service
  }, []);
  // on refresh if the route is not the base redirect to base
  /// wizardHook => defineUser | createResource | loadingResource | route to go | progressBar

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardBaseRoute={`/${currentWorkspace.id}/${currentProject.id}/create-resource`}
        wizardPattern={
          defineUser === "login"
            ? [1, 2, 3, 4, 5, 6, 8]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        wizardSubmit={createResource}
        moduleCss={moduleClass}
      >
        <CreateServiceWelcome moduleClass={moduleClass} path="welcome" />
        <CreateServiceName moduleClass={moduleClass} path="service-name" />
        <CreateGithubSync moduleClass={moduleClass} path="github-sync" />
        <CreateGenerationSettings
          moduleClass={moduleClass}
          path="generation-settings"
        />
        <CreateServiceRepository moduleClass={moduleClass} path="repository" />
        <CreateServiceDatabase moduleClass={moduleClass} path="data-base" />
        <CreateServiceAuth moduleClass={moduleClass} path="auth" />
        <CreateServiceCodeGeneration
          moduleClass="create-service-code-generation"
          path="build"
        />
        <CreateServiceNextSteps moduleClass={moduleClass} path="end" />
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
