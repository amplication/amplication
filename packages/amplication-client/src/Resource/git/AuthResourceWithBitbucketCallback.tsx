import { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { EnumGitProvider } from "../../models";

const AuthResourceWithBitbucketCallback = () => {
  const { trackEvent } = useTracking();
  const [completeAuthWithGit] = useMutation<boolean>(COMPLETE_OAUTH2_FLOW, {
    onCompleted: (data) => {
      window.opener.postMessage({ completed: true });
      // close the popup
      window.close();
    },
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const authorizationCode = urlParams.get("code");
    if (window.opener) {
      trackEvent({
        eventName: AnalyticsEventNames.GitHubAuthResourceComplete,
      });
      completeAuthWithGit({
        variables: {
          code: authorizationCode,
          gitProvider: EnumGitProvider.Bitbucket,
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGit, trackEvent]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

export default AuthResourceWithBitbucketCallback;

const COMPLETE_OAUTH2_FLOW = gql`
  mutation completeGitOAuth2Flow(
    $code: String!
    $gitProvider: EnumGitProvider!
  ) {
    completeGitOAuth2Flow(data: { code: $code, gitProvider: $gitProvider }) {
      id
      name
    }
  }
`;
