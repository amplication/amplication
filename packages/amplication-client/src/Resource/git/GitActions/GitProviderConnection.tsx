import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback } from "react";
import { EnumGitProvider } from "../../../models";

import classNames from "classnames";
import "./GitProviderConnection.scss";

import { LockedFeatureIndicator } from "../../../Components/LockedFeatureIndicator";
import { PROVIDERS_DISPLAY_NAME } from "../../constants";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
  disabled?: boolean;
  comingSoon?: boolean;
  featureName?: string;
};

const CLASS_NAME = "git-provider-connection";

export default function GitProviderConnection({
  onSyncNewGitOrganizationClick,
  provider,
  disabled,
  comingSoon,
  featureName,
}: Props) {
  const handleClick = useCallback(() => {
    onSyncNewGitOrganizationClick(provider);
  }, [provider]);

  const providerDisplayName = PROVIDERS_DISPLAY_NAME[provider];

  return (
    <div
      className={classNames(CLASS_NAME, { enabled: !comingSoon && !disabled })}
    >
      <img
        src={`../../../../assets/images/${provider?.toLowerCase()}.svg`}
        alt=""
      />
      <div className={`${CLASS_NAME}__name`}>{providerDisplayName}</div>
      <div className={`${CLASS_NAME}__controls`}>
        {disabled && <LockedFeatureIndicator featureName={featureName} />}
        {!comingSoon ? (
          <Button
            className={`${CLASS_NAME}__connect`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleClick}
            disabled={disabled}
          >
            Connect
          </Button>
        ) : (
          <div className={`${CLASS_NAME}__coming_soon`}>Coming soon</div>
        )}
      </div>
    </div>
  );
}
