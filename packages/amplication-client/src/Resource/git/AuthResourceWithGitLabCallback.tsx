import { useEffect } from "react";
import { GET_PROJECTS } from "../../Workspaces/queries/projectQueries";
import {
  EnumGitProvider,
  useCompleteGitOAuth2FlowMutation,
} from "../../models";
import { useTracking } from "../../util/analytics";

const AuthResourceWithGitLabCallback = () => {
  const { trackEvent } = useTracking();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const authorizationCode = urlParams.get("code");

  const [completeAuthWithGit] = useCompleteGitOAuth2FlowMutation({
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
    variables: {
      code: authorizationCode,
      gitProvider: EnumGitProvider.GitLab,
    },
  });

  useEffect(() => {
    if (window.opener) {
      completeAuthWithGit({
        variables: {
          code: authorizationCode,
          gitProvider: EnumGitProvider.GitLab,
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGit, trackEvent]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

export default AuthResourceWithGitLabCallback;
