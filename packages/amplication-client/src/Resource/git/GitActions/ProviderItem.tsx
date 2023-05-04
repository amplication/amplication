import { Button, EnumButtonStyle, Icon } from "@amplication/ui/design-system";
import { EnumGitProvider } from "../../../models";
import React, { useCallback } from "react";
import { ENTER } from "../../../util/hotkeys";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
};

export default function ProviderItem({
  onSyncNewGitOrganizationClick,
  provider,
}: Props) {
  const handleClick = useCallback(() => {
    onSyncNewGitOrganizationClick(provider);
  }, [provider]);

  const handleKeyDown = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyEvent.key === ENTER) {
        onSyncNewGitOrganizationClick(provider);
      }
    },
    [provider]
  );

  return (
    <div className="auth-with-git__providerItem">
      <div className="auth-with-git__providerIcon">
        <Icon icon={"github"} size={"medium"}></Icon>
        {provider === EnumGitProvider.Github ? "GitHub" : ""}
      </div>
      <Button
        onKeyDown={handleKeyDown}
        buttonStyle={EnumButtonStyle.Primary}
        onClick={handleClick}
      >
        {`Connect`}
      </Button>
    </div>
  );
}
