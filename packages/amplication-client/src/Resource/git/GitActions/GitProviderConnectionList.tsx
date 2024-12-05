import { Dialog } from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { gql, useMutation } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";
import { useCallback, useState } from "react";
import {
  AuthorizeResourceWithGitResult,
  EnumGitProvider,
} from "../../../models";
import { useTracking } from "../../../util/analytics";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import GitProviderConnection from "./GitProviderConnection";
import GitProviderConnectionAzureOrganizationForm from "./GitProviderConnectionAzureOrganizationForm";
import "./GitProviderConnectionList.scss";

type DType = {
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
// eslint-disable-next-line
let triggerAuthFailed = (errorMessage?: string) => {};

export type Props = {
  onDone: () => void;
  setPopupFailed: (status: boolean) => void;
  onProviderSelect?: (data: any) => any;
  onSelectRepository?: () => void;
  onError?: (error: string) => void;
};

const CLASS_NAME = "git-provider-connection-list";

export const GitProviderConnectionList: React.FC<Props> = ({
  onDone,
  setPopupFailed,
  onProviderSelect,
  onSelectRepository,
  onError,
}) => {
  const { trackEvent } = useTracking();
  const { stigg } = useStiggContext();

  const showBitbucketConnect = stigg.getBooleanEntitlement({
    featureId: BillingFeature.Bitbucket,
  }).hasAccess;
  const showGitLab = stigg.getBooleanEntitlement({
    featureId: BillingFeature.GitLab,
  }).hasAccess;
  const showAzureDevops = stigg.getBooleanEntitlement({
    featureId: BillingFeature.AzureDevops,
  }).hasAccess;

  const [showAzureOrgName, setShowAzureOrgName] = useState(false);

  const [authWithGit] = useMutation<DType>(START_AUTH_APP_WITH_GITHUB, {
    onCompleted: (data) => {
      openSignInWindow(data.getGitResourceInstallationUrl.url, "auth with git");
    },
  });

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = (errorMessage?: string) => {
    //if an error was returned from the other window, show the error
    if (errorMessage) {
      onError && onError(errorMessage);
    } else {
      setPopupFailed(true);
    }
  };

  const handleAddProvider = useCallback(
    (provider: EnumGitProvider, state?: string) => {
      trackEvent({
        eventName: AnalyticsEventNames.GitProviderConnectClick,
        eventOriginLocation: "git-provider-connection-list",
        provider: provider,
      });
      authWithGit({
        variables: {
          gitProvider: provider,
          state,
        },
      }).catch(console.error);
      onProviderSelect && onProviderSelect(provider);
    },
    [authWithGit, trackEvent, onProviderSelect]
  );

  const handleAzureDevops = useCallback(() => {
    setShowAzureOrgName(true);
  }, []);

  return (
    <div className={CLASS_NAME}>
      <GitProviderConnection
        provider={EnumGitProvider.Github}
        onSyncNewGitOrganizationClick={handleAddProvider}
        disabled={false}
      />
      <GitProviderConnection
        provider={EnumGitProvider.Bitbucket}
        onSyncNewGitOrganizationClick={handleAddProvider}
        billingFeature={BillingFeature.Bitbucket}
        disabled={!showBitbucketConnect}
      />
      <GitProviderConnection
        provider={EnumGitProvider.GitLab}
        onSyncNewGitOrganizationClick={handleAddProvider}
        billingFeature={BillingFeature.GitLab}
        disabled={!showGitLab}
      />
      <GitProviderConnection
        provider={EnumGitProvider.AzureDevOps}
        onSyncNewGitOrganizationClick={handleAzureDevops}
        billingFeature={BillingFeature.AzureDevops}
        disabled={!showAzureDevops}
      />
      <GitProviderConnection
        provider={EnumGitProvider.AwsCodeCommit}
        onSyncNewGitOrganizationClick={() => {
          // Manual work following Notion docs
        }}
        billingFeature={BillingFeature.AwsCodeCommit}
        disabled={true}
      />
      <Dialog
        isOpen={showAzureOrgName}
        title="Connect to Azure DevOps"
        onDismiss={() => setShowAzureOrgName(false)}
      >
        <GitProviderConnectionAzureOrganizationForm
          onSubmit={(values) => {
            setShowAzureOrgName(false);
            handleAddProvider(EnumGitProvider.AzureDevOps, values.organization);
          }}
        />
      </Dialog>
    </div>
  );
};

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitResourceInstallationUrl(
    $gitProvider: EnumGitProvider!
    $state: String
  ) {
    getGitResourceInstallationUrl(
      data: { gitProvider: $gitProvider, state: $state }
    ) {
      url
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
  }
  if (data.failed) {
    triggerAuthFailed(data.errorMessage);
  }
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  const width = 600;
  const height = 700;

  const left = (window.screen.width - width) / 2;
  const top = 100;

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  windowObjectReference = window.open(url, name, strWindowFeatures);
  if (windowObjectReference) {
    windowObjectReference.focus();
  } else {
    triggerAuthFailed();
  }

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
