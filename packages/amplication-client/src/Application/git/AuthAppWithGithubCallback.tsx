import React, { useEffect } from "react";
//import { match } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useTracking } from "../../util/analytics";


const AuthAppWithGithubCallback = () => { 
  const { trackEvent } = useTracking();
  const [completeAuthWithGithub] = useMutation<Boolean>(
    CREATE_GIT_ORGANIZATION,
    {
      onCompleted: (data) => {
        window.opener.postMessage({ completed: true });
        // close the popup
        window.close();
      },
    }
  );

  useEffect(() => {
    // get the URL parameters with the code and state values
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const workspaceId = urlParams.get("state");
    const installationId = urlParams.get("installation_id");
    if (window.opener) {
      trackEvent({
        eventName: "completeAuthAppWithGitHub",
      });
      completeAuthWithGithub({
        variables: {
          workspaceId,
          installationId,
          provider: "Github"
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGithub, trackEvent]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

export default AuthAppWithGithubCallback;


const CREATE_GIT_ORGANIZATION = gql`
  mutation createOrganization(
    $workspaceId: String!
    $installationId: String!
    $provider: EnumSourceControlService!
  ) {
    createOrganization(
      data: { workspaceId: $workspaceId , installationId: $installationId,provider:$provider},
    ) {
      id
      name
    }
  }
`;

// const COMPLETE_AUTH_APP_WITH_GITHUB = gql`
//   mutation completeAuthorizeAppWithGithub(
//     $state: String!
//     $installationId: String!
//   ) {
//     completeAuthorizeAppWithGithub(
//       data: { state: $state , installationId: $installationId}
//     ) {
//       id
//       createdAt
//       updatedAt
//       name
//       description
//       color
//       githubTokenCreatedDate
//       githubSyncEnabled
//       githubRepo
//       githubLastSync
//       githubLastMessage
//     }
//   }
// `;
