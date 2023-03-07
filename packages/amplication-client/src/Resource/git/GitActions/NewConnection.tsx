import { Button, EnumButtonStyle } from "@amplication/design-system";
import { EnumGitProvider } from "../../../models";
import React from "react";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
};

export default function NewConnection({
  onSyncNewGitOrganizationClick,
  provider,
}: Props) {
  return (
    <Button
      buttonStyle={EnumButtonStyle.Primary}
      onClick={onSyncNewGitOrganizationClick}
      icon="github"
    >
      {`Connect to ${provider}`}
    </Button>
  );
}
