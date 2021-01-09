import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { Snackbar } from "@rmwc/snackbar";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import { Button, EnumButtonStyle } from "../Components/Button";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";

import "./AuthAppWithGithub.scss";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
const CLASS_NAME = "settings-page";

type DType = {
  startAuthorizeAppWithGithub: models.AuthorizeAppWithGithubResult;
};

type Props = {
  match: match<{ application: string }>;
};

function AuthAppWithGithub({ match }: Props) {
  useBreadcrumbs(match.url, "Settings");
  const { application } = match.params;

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
          appId: application,
        },
      }).catch(console.error);
    },
    [authWithGithub, application]
  );
  const errorMessage = formatError(error);

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />

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
      </main>
    </PageContent>
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
  /**@todo: refresh the page to continue the process */
  const { data } = event;
  //check if we trust the sender and the source is our popup
  console.log("data", data);
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  // window features
  const strWindowFeatures =
    "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

  windowObjectReference = window.open(url, name, strWindowFeatures);
  windowObjectReference.focus();

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
