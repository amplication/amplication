import { AnimationType, Loader } from "@amplication/design-system";
import React from "react";
import "./CreateServiceWizard.scss";

// eslint-disable-next-line @typescript-eslint/ban-types
const CreateServiceLoader: React.FC<{}> = () => {
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

      <div className={`${CLASS_NAME}__processing__tagline`}>
        <div>For a full experience, connect with a GitHub repository</div>
        <div>
          and get a new Pull Request every time you make changes in your data
          model.
        </div>
      </div>
    </div>
  );
};

export default CreateServiceLoader;
