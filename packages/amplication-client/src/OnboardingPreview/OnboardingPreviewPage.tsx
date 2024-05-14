import React from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "@amplication/ui/design-system";

import OnboardingPreview from "./OnboardingPreview";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OnboardingPreviewPage: React.FC = () => {
  const query = useQuery();

  const projectId = query.get("projectId");
  const workspaceId = query.get("workspaceId");

  return (
    <Modal open fullScreen showCloseButton={false}>
      <OnboardingPreview workspaceId={workspaceId} projectId={projectId} />
    </Modal>
  );
};

export default OnboardingPreviewPage;
