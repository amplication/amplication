import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback } from "react";
import { EnumGitProvider } from "../../../models";

import classNames from "classnames";
import "./GitProviderConnection.scss";

import { GIT_PROVIDER_NAME } from "../constants";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
  FeatureIndicatorPlacement,
} from "../../../Components/FeatureIndicatorContainer";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
  disabled?: boolean;
  billingFeature?: BillingFeature;
};

const CLASS_NAME = "git-provider-connection";

export default function GitProviderConnection({
  onSyncNewGitOrganizationClick,
  provider,
  disabled,
  billingFeature,
}: Props) {
  const handleClick = useCallback(() => {
    onSyncNewGitOrganizationClick(provider);
  }, [onSyncNewGitOrganizationClick, provider]);

  const providerDisplayName = GIT_PROVIDER_NAME[provider];

  return (
    <div className={classNames(CLASS_NAME, { enabled: !disabled })}>
      <img
        src={`../../../../assets/images/${provider?.toLowerCase()}.svg`}
        alt=""
      />
      <div className={`${CLASS_NAME}__name`}>{providerDisplayName}</div>
      <div className={`${CLASS_NAME}__controls`}>
        <FeatureIndicatorContainer
          featureId={billingFeature}
          entitlementType={EntitlementType.Boolean}
          reversePosition={true}
          featureIndicatorPlacement={FeatureIndicatorPlacement.Outside}
          limitationText="Available in Enterprise plans only. "
        >
          <Button
            className={`${CLASS_NAME}__connect`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleClick}
          >
            Connect
          </Button>
        </FeatureIndicatorContainer>
      </div>
    </div>
  );
}
