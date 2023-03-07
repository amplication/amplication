import React from "react";
import { match } from "react-router-dom";
import "./CreateServiceWizard.scss";
import { AppRouteProps } from "../../routes/routesUtil";
import OnBoardingBuildPage from "../../VersionControl/OnBoardingBuildPage";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceCodeGeneration: React.FC<Props> = ({ moduleClass }) => {
  return (
    <div className={`${moduleClass}__service_box`}>
      <div className={`${moduleClass}__code_gen_title`}>
        <h2>All set! We’re currently generating your service.</h2>
        <h3>It should only take a few seconds to finish. Don't go away!</h3>
        {/* <OnBoardingBuildPage match={undefined}></OnBoardingBuildPage> */}
      </div>
    </div>
  );
};

export default CreateServiceCodeGeneration;
