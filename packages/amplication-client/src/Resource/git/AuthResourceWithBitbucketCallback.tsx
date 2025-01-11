import { useEffect } from "react";
import { GET_PROJECTS } from "../../Workspaces/queries/projectQueries";
import {
  EnumGitProvider,
  useCompleteGitOAuth2FlowMutation,
} from "../../models";
import { useTracking } from "../../util/analytics";

const AuthResourceWithBitbucketCallback = () => {
  const { trackEvent } = useTracking();

  const [completeAuthWithGit] = useCompleteGitOAuth2FlowMutation({
    onCompleted: (data) => {
      window.opener.postMessage({
        completed: true,
        id: data.completeGitOAuth2Flow.id,
        name: data.completeGitOAuth2Flow.name,
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const authorizationCode = urlParams.get("code");
    if (window.opener) {
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
