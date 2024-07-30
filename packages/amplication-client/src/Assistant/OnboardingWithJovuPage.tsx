import { Modal } from "@amplication/ui/design-system";
import React from "react";

import OnboardingWithJovu from "./OnboardingWithJovu";

const OnboardingPreviewPage: React.FC = () => {
  return (
    <Modal open fullScreen showCloseButton={false}>
      <OnboardingWithJovu />
    </Modal>
  );
};

export default OnboardingPreviewPage;
