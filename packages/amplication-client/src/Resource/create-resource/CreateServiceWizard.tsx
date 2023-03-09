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

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

export interface ResourceSettings {
  serviceName: string;
  gitRepositoryId: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  structureType: "monorepo" | "polyrepo";
  dataBaseType: "postgres" | "mysql" | "mongo";
  authSwitch: boolean;
}
export interface NextPage {
  nextTitle: string;
  isValid: boolean;
}

const CreateServiceWizard: React.FC<Props> = ({ moduleClass, ...props }) => {
  const { errorCreateService } = useContext(AppContext);
  const defineUser = (props.location.state as "signup" | "login") || "login";
  const resourceSettingsRef: MutableRefObject<ResourceSettings> = useRef();

  const errorMessage = formatError(errorCreateService);

  const createResource = useCallback((values: ResourceSettings) => {
    // at the end of the process this function will trigger create service
  }, []);

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardPattern={
          defineUser === "login"
            ? [1, 2, 3, 4, 5, 6, 8]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        context={{
          submitWizard: createResource,
          resourceSettingsRef,
        }}
        moduleCss={moduleClass}
      >
        <CreateServiceWelcome moduleCss={moduleClass} />
        <CreateServiceName moduleCss={moduleClass} />
        <CreateGithubSync moduleClass={moduleClass} />
        <CreateGenerationSettings moduleClass={moduleClass} />
        <CreateServiceRepository moduleClass={moduleClass} />
        <CreateServiceDatabase moduleClass={moduleClass} />
        <CreateServiceAuth moduleClass={moduleClass} />
        <div>page 7</div>
        <div>end of wizard - 8</div>
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
