import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { EnumGitProvider } from "../../models";
import { CREATE_GIT_ORGANIZATION } from "./queries/git-callback";

const AuthResourceWithGithubCallback = () => {
  const { trackEvent } = useTracking();
  const [completeAuthWithGit] = useMutation<boolean>(CREATE_GIT_ORGANIZATION, {
    onCompleted: (data) => {
      window.opener.postMessage({ completed: true });
      // close the popup
      window.close();
    },
  });

  useEffect(() => {
    // get the URL parameters with the code and state values
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const installationId = urlParams.get("installation_id");
    if (window.opener) {
      trackEvent({
        eventName: AnalyticsEventNames.GitHubAuthResourceComplete,
      });
      completeAuthWithGit({
        variables: {
          installationId,
          gitProvider: EnumGitProvider.Github,
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGit, trackEvent]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

export default AuthResourceWithGithubCallback;
