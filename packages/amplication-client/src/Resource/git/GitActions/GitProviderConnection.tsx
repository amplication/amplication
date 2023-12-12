import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback } from "react";
import { EnumGitProvider } from "../../../models";

import classNames from "classnames";
import "./GitProviderConnection.scss";

import { FeatureIndicator } from "../../../Components/FeatureIndicator";
import { PROVIDERS_DISPLAY_NAME } from "../../constants";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
  FeatureIndicatorPlacement,
  IconType,
} from "../../../Components/FeatureIndicatorContainer";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
  disabled?: boolean;
  comingSoon?: boolean;
  featureName?: string;
  billingFeature?: BillingFeature;
};

const CLASS_NAME = "git-provider-connection";

export default function GitProviderConnection({
  onSyncNewGitOrganizationClick,
  provider,
  disabled,
  comingSoon,
  featureName,
  billingFeature,
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
        {disabled && <FeatureIndicator featureName={featureName} />}
        {!comingSoon ? (
          <FeatureIndicatorContainer
            featureId={billingFeature}
            entitlementType={EntitlementType.Boolean}
            reversePosition={true}
            featureIndicatorPlacement={FeatureIndicatorPlacement.Outside}
          >
            <Button
              className={`${CLASS_NAME}__connect`}
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handleClick}
            >
              Connect
            </Button>
          </FeatureIndicatorContainer>
        ) : (
          <div className={`${CLASS_NAME}__coming_soon`}>
            <FeatureIndicator
              featureName={featureName}
              comingSoon={true}
              text="for GitLab integration"
              linkText="Contact us"
              icon={IconType.Lock}
            />
            <Button
              className={`${CLASS_NAME}__connect`}
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handleClick}
              disabled={true}
            >
              Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
