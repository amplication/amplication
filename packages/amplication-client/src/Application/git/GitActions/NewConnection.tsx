import { Button, EnumButtonStyle } from "@amplication/design-system";
import React from "react";

type Props = {
  onSyncNewGitHubOrganizationClick: (data: any) => any;
};

export default function NewConnection({
  onSyncNewGitHubOrganizationClick,
}: Props) {
  return (
    <Button
      buttonStyle={EnumButtonStyle.Primary}
      onClick={onSyncNewGitHubOrganizationClick}
      icon="github"
    >
      Sync with GitHub
    </Button>
  );
}
