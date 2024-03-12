import GitProviderConnection from "./GitProviderConnection";
import {
  AuthorizeResourceWithGitResult,
  EnumGitProvider,
} from "../../../models";
import { useTracking } from "../../../util/analytics";
import "./GitProviderConnectionList.scss";
import { useCallback } from "react";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { gql, useMutation } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";

type DType = {
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
// eslint-disable-next-line
let triggerAuthFailed = () => {};

export type Props = {
  onDone: () => void;
  setPopupFailed: (status: boolean) => void;
  onProviderSelect?: (data: any) => any;
  onSelectRepository?: () => void;
};

const CLASS_NAME = "git-provider-connection-list";

export const GitProviderConnectionList: React.FC<Props> = ({
  onDone,
  setPopupFailed,
  onProviderSelect,
  onSelectRepository,
}) => {
  const { trackEvent } = useTracking();
  const { stigg } = useStiggContext();

  const showBitbucketConnect = stigg.getBooleanEntitlement({
    featureId: BillingFeature.Bitbucket,
  }).hasAccess;
  const showGitLab = stigg.getBooleanEntitlement({
    featureId: BillingFeature.GitLab,
  }).hasAccess;

  const [authWithGit] = useMutation<DType>(START_AUTH_APP_WITH_GITHUB, {
    onCompleted: (data) => {
      openSignInWindow(data.getGitResourceInstallationUrl.url, "auth with git");
    },
  });

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };

  const handleAddProvider = useCallback(
    (provider: EnumGitProvider) => {
      trackEvent({
        eventName: AnalyticsEventNames.GitProviderConnectClick,
        eventOriginLocation: "git-provider-connection-list",
        provider: provider,
      });
      authWithGit({
        variables: {
          gitProvider: provider,
        },
      })
        .then(() => {
          onSelectRepository();
        })
        .catch(console.error);
      onProviderSelect && onProviderSelect(provider);
    },
    [authWithGit, trackEvent, onProviderSelect]
  );

  return (
    <div className={CLASS_NAME}>
      <GitProviderConnection
        provider={EnumGitProvider.Github}
        onSyncNewGitOrganizationClick={handleAddProvider}
        disabled={false}
      />
      <GitProviderConnection
        provider={EnumGitProvider.GitLab}
        onSyncNewGitOrganizationClick={handleAddProvider}
        billingFeature={BillingFeature.GitLab}
        disabled={!showGitLab}
        comingSoon={true}
      />
      <GitProviderConnection
        provider={EnumGitProvider.Bitbucket}
        onSyncNewGitOrganizationClick={handleAddProvider}
        billingFeature={BillingFeature.Bitbucket}
        disabled={!showBitbucketConnect}
      />
      <GitProviderConnection
        provider={EnumGitProvider.AwsCodeCommit}
        onSyncNewGitOrganizationClick={() => {
          // Manual work following Notion docs
        }}
        billingFeature={BillingFeature.AwsCodeCommit}
        disabled={true}
        comingSoon={true}
      />
    </div>
  );
};

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitResourceInstallationUrl($gitProvider: EnumGitProvider!) {
    getGitResourceInstallationUrl(data: { gitProvider: $gitProvider }) {
      url
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
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
