import { Button, EnumButtonStyle, Icon } from "@amplication/ui/design-system";
import { EnumGitProvider } from "../../../models";
import React, { useCallback } from "react";

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

  return (
    <div className="auth-with-git__providerItem">
      {provider && (
        <div className="auth-with-git__providerIcon">
          <Icon
            icon={EnumGitProvider[provider].toLowerCase()}
            size={"medium"}
          ></Icon>
          {EnumGitProvider[provider]}
        </div>
      )}
      <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleClick}>
        {`Connect`}
      </Button>
    </div>
  );
}
