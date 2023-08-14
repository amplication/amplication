import { useEffect } from "react";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import {
  EnumGitProvider,
  useCreateOrganizationGitHubMutation,
} from "../../models";
import { GET_PROJECTS } from "../../Workspaces/queries/projectQueries";

const AuthResourceWithGithubCallback = () => {
  const { trackEvent } = useTracking();

  const [completeAuthWithGit] = useCreateOrganizationGitHubMutation({
    onCompleted: (data) => {
      window.opener.postMessage({ completed: true });
      // close the popup
      window.close();
    },
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  useEffect(() => {
    // get the URL parameters with the code and state values
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const installationId = urlParams.get("installation_id");
    if (window.opener) {
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
