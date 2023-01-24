import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  TextField,
  TextInput,
} from "@amplication/design-system";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import "./CreateServiceWizard.scss";
import * as models from "../../models";

import { AppRouteProps } from "../../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceRepository: React.FC<Props> = ({ moduleClass }) => {
  return (
    <div className={`${moduleClass}__splitWrapper`}>
      <div className={`${moduleClass}__left`}>
        <div className={`${moduleClass}__service_name_header`}>
          <h2>Are you using a monorepo or polyrepo?</h2>
        </div>
        <div className={`${moduleClass}__description_bottom`}>
          <h3>
            If you are using a monorepo, you can select the folder where you
            want to save the code of the service. “apps”, “packages”,
            “ee/packages” all are valid. Otherwise, Amplication will push the
            code to the root of the repo in separate folders for the server and
            the admin-ui.
          </h3>
        </div>
      </div>
      <div className={`${moduleClass}__right`}>
        <h3>
          If you are using a monorepo, you can select the folder where you want
          to save the code of the service. “apps”, “packages”, “ee/packages” all
          are valid. Otherwise, Amplication will push the code to the root of
          the repo in separate folders for the server and the admin-ui.
        </h3>
      </div>
    </div>
  );
};

export default CreateServiceRepository;
