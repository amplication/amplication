import React, { useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

type Props = {
  match: match<{ application: string }>;
};

export default ({ match }: Props) => {
  const { application } = match.params;

  const [completeAuthWithGithub] = useMutation<Boolean>(
    COMPLETE_AUTH_APP_WITH_GITHUB,
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
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    if (window.opener) {
      completeAuthWithGithub({
        variables: {
          appId: application,
          code,
          state,
        },
      }).catch(console.error);
    }
  }, [completeAuthWithGithub, application]);

  /**@todo: show formatted layout and optional error message */
  return <p>Please wait...</p>;
};

const COMPLETE_AUTH_APP_WITH_GITHUB = gql`
  mutation completeAuthorizeAppWithGithub(
    $appId: String!
    $code: String!
    $state: String!
  ) {
    completeAuthorizeAppWithGithub(
      data: { code: $code, state: $state }
      where: { id: $appId }
    ) {
      id
      createdAt
      updatedAt
      name
      description
      color
      githubTokenCreatedDate
      githubSyncEnabled
      githubRepo
      githubLastSync
      githubLastMessage
    }
  }
`;
