import { Button, EnumButtonStyle } from "@amplication/design-system";
import { EnumGitProvider } from "../../../models";
import React, { useCallback } from "react";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
};

export default function NewConnection({
  onSyncNewGitOrganizationClick,
  provider,
}: Props) {
  const handleClick = useCallback(() => {
    onSyncNewGitOrganizationClick(provider);
  }, [provider]);

  return (
    <Button
      buttonStyle={EnumButtonStyle.Primary}
      onClick={handleClick}
      icon="github"
    >
      {`Connect to ${provider}`}
    </Button>
  );
}
