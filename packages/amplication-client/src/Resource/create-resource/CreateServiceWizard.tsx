import { Modal, Snackbar, Loader } from "@amplication/design-system";
import React, { MutableRefObject, useContext, useRef } from "react";
import { match, useHistory } from "react-router-dom";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import { serviceSettings } from "./CreateServiceWizardForm";
import * as models from "../../models";
import { serviceSettingsFieldsInitValues } from "../constants";

import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";
import CreateServiceWizardFooter from "./CreateServiceWizardFooter";
import CreateServiceWelcome from "./CreateServiceWelcome";
import CreateServiceLoader from "./CreateServiceLoader";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass, ...props }) => {
  const {
    currentProject,
    setNewService,
    currentWorkspace,
    errorCreateService,
    loadingCreateService,
  } = useContext(AppContext);

  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  );

  const errorMessage = formatError(errorCreateService);

  const handleSubmitResource = (currentServiceSettings: serviceSettings) => {
    serviceSettingsFields.current = currentServiceSettings;
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreateService ? (
        <CreateServiceLoader />
      ) : (
        <div className={`${moduleClass}__left`}>
          <CreateServiceWelcome />
          {props.innerRoutes}
          <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
        </div>
      )}
      <CreateServiceWizardFooter />
    </Modal>
  );
};

export default CreateServiceWizard;
