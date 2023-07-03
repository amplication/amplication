import { AnimationType, Loader } from "@amplication/ui/design-system";
import React from "react";
import "./CreateServiceWizard.scss";

const CreateServiceLoader: React.FC = () => {
  const CLASS_NAME = "create-service-wizard";

  return (
    <div className={`${CLASS_NAME}__processing`}>
      <div className={`${CLASS_NAME}__processing__message_title_container`}>
        <div className={`${CLASS_NAME}__processing__title`}>
          All set! We’re currently generating your service.
        </div>
        <div className={`${CLASS_NAME}__processing__message`}>
          It should only take a few seconds to finish. Don't go away!
        </div>
      </div>
      <div className={`${CLASS_NAME}__processing__loader`}>
        <Loader animationType={AnimationType.Full} />
      </div>
    </div>
  );
};

export default CreateServiceLoader;
