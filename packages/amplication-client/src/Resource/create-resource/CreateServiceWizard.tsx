import { Modal, Snackbar } from "@amplication/design-system";
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
import { serviceSettings } from "./CreateServiceWizardForm";
import { serviceSettingsFieldsInitValues } from "../constants";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";
import CreateServiceWelcome from "./CreateServiceWelcome";
import ServiceWizard from "./ServiceWizard";
import CreateServiceName from "./CreateServiceName";

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

const wizardSchema = {
  step0: {
    serviceName: {
      type: "String",
      require: true,
      min: 2,
    },
  },
  step1: {
    gitProvider: {},
  },
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass, ...props }) => {
  const { errorCreateService } = useContext(AppContext);
  // const [validate];
  const defineUser = (props.location.state as "signup" | "login") || "login";
  const resourceSettingsRef: MutableRefObject<ResourceSettings> = useRef();

  const onWizardChangeCb = useCallback(() => {
    // assign new values to ref
    // validation to continue button
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
        wizardLen={4}
      >
        <CreateServiceWelcome moduleCss={moduleClass} />
        <CreateServiceName moduleCss={moduleClass} />
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
