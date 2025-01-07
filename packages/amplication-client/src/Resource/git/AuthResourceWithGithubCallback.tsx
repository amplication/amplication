import { useEffect } from "react";
import { GET_PROJECTS } from "../../Workspaces/queries/projectQueries";
import {
  EnumGitProvider,
  useCreateOrganizationGitHubMutation,
} from "../../models";
import { useTracking } from "../../util/analytics";

const AuthResourceWithGithubCallback = () => {
  const { trackEvent } = useTracking();

  const [completeAuthWithGit] = useCreateOrganizationGitHubMutation({
    onCompleted: (data) => {
      window.opener.postMessage({
        completed: true,
        id: data.createOrganization.id,
        name: data.createOrganization.name,
      });
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
