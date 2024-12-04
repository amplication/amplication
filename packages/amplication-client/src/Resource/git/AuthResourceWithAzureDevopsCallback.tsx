import { useEffect, useState } from "react";
import { GET_PROJECTS } from "../../Workspaces/queries/projectQueries";
import {
  EnumGitProvider,
  useCompleteGitOAuth2FlowMutation,
} from "../../models";
import { useTracking } from "../../util/analytics";

const AuthResourceWithAzureDevopsCallback = () => {
  const { trackEvent } = useTracking();

  const [loading, setLoading] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const authorizationCode = urlParams.get("code");
  const error = urlParams.get("error");
  const errorDescription = urlParams.get("error_description");

  const [completeAuthWithGit] = useCompleteGitOAuth2FlowMutation({
    onCompleted: (data) => {
      window.opener.postMessage({ completed: true });
      // close the popup
      window.close();
    },
    onError: (error) => {
      console.error(error);
    },
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
    variables: {
      code: authorizationCode,
      gitProvider: EnumGitProvider.AzureDevOps,
    },
  });

  useEffect(() => {
    if (window.opener && !loading && authorizationCode) {
      setLoading((loading) => {
        if (!loading) {
          completeAuthWithGit({
            variables: {
              code: authorizationCode,
              gitProvider: EnumGitProvider.AzureDevOps,
            },
          }).catch(console.error);
        }
        return true;
      });
    }
  }, [authorizationCode, completeAuthWithGit, loading, trackEvent]);

  /**@todo: show formatted layout and optional error message */

  if (error) {
    return (
      <p>
        Error: {error} {errorDescription}
      </p>
    );
  }

  return <p>Please wait...</p>;
};

export default AuthResourceWithAzureDevopsCallback;
