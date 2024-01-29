import { AnimationType, Loader } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import "./CreateApplyChangesLoader.scss";

type Props = {
  onTimeout: () => void;
  minimumLoadTimeMS?: number;
};

const CreateApplyChangesLoader = ({ onTimeout, minimumLoadTimeMS }: Props) => {
  const CLASS_NAME = "create-apply-changes-loader";

  useEffect(() => {
    if (!minimumLoadTimeMS) return;
    const timer = setTimeout(() => {
      onTimeout && onTimeout();
    }, minimumLoadTimeMS);

    return () => clearTimeout(timer);
  }, [onTimeout, minimumLoadTimeMS]);

  return (
    <div className={`${CLASS_NAME}`}>
      <h2>Processing your new architecture.</h2>
      <span>
        Please wait as we handle the creation of your new architectural design.
      </span>
      <div className={`${CLASS_NAME}__animation`}>
        <Loader animationType={AnimationType.Full} />
      </div>
    </div>
  );
};

export default CreateApplyChangesLoader;
