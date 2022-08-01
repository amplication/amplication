import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useTracking } from "../../util/analytics";

const AuthResourceWithGitCallback = () => {
  const { trackEvent } = useTracking();
  const [completeAuthWithGit] = useMutation<Boolean>(CREATE_GIT_ORGANIZATION, {
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
        eventName: "completeAuthResourceWithGitHub",
      });
      completeAuthWithGit({
        variables: {
          installationId,
          gitProvider: "Github",
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGit, trackEvent]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

export default AuthResourceWithGitCallback;

const CREATE_GIT_ORGANIZATION = gql`
  mutation createOrganization(
    $installationId: String!
    $gitProvider: EnumGitProvider!
  ) {
    createOrganization(
      data: { installationId: $installationId, gitProvider: $gitProvider }
    ) {
      id
      name
    }
  }
`;
