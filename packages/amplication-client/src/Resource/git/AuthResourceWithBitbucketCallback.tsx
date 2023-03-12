import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { EnumGitProvider } from "../../models";
import { COMPLETE_OAUTH2_FLOW } from "./queries/git-callback";

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
