import React, { useCallback } from "react";
import { Icon } from "@rmwc/icon";
import { Snackbar } from "@rmwc/snackbar";
import { Button, EnumButtonStyle } from "../Components/Button";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";

type DType = {
  startAuthorizeAppWithGithub: models.AuthorizeAppWithGithubResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};

type Props = {
  applicationId: string;
  onDone: () => void;
};

function AuthAppWithGithub({ applicationId, onDone }: Props) {
  const [authWithGithub, { loading, error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {
        openSignInWindow(
          data.startAuthorizeAppWithGithub.url,
          "auth with github"
        );
      },
    }
  );

  const handleAuthWithGithubClick = useCallback(
    (data) => {
      authWithGithub({
        variables: {
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [authWithGithub, applicationId]
  );

  triggerOnDone = () => {
    onDone();
  };
  const errorMessage = formatError(error);

  return (
    <div>
      <Button
        type="button"
        onClick={handleAuthWithGithubClick}
        disabled={loading}
        buttonStyle={EnumButtonStyle.CallToAction}
        eventData={{
          eventName: "authAppInWithGitHub",
        }}
      >
        <Icon icon="github" />
        Connect your app with GitHub
      </Button>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default AuthAppWithGithub;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation startAuthorizeAppWithGithub($appId: String!) {
    startAuthorizeAppWithGithub(where: { id: $appId }) {
      url
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
  }
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  const width = 600;
  const height = 700;

  const left = (window.screen.width - width) / 2;
  const top = 100;

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  windowObjectReference = window.open(url, name, strWindowFeatures);
  windowObjectReference.focus();

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
