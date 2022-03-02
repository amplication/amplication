import { Button, EnumButtonStyle } from "@amplication/design-system";
import React from "react";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
};

export default function NewConnection({
  onSyncNewGitOrganizationClick,
}: Props) {
  return (
    <Button
      buttonStyle={EnumButtonStyle.Primary}
      onClick={onSyncNewGitOrganizationClick}
      icon="github"
    >
      Connect to GitHub
    </Button>
  );
}
