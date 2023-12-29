import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import "./Signup.scss";
import { setToken } from "../authentication/authentication";

const SignupPreviewAccount = () => {
  const history = useHistory();

  const [signupPreviewAccount, { loading, error }] = useMutation<{
    signupPreviewAccount: {
      token: string;
      workspaceId: string;
      resourceId: string;
      projectId: string;
    };
  }>(SIGNUP_PREVIEW_ACCOUNT);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get("email");
    const previewAccountType = urlParams.get("previewAccountType");

    if (email && previewAccountType) {
      signupPreviewAccount({
        variables: {
          data: {
            previewAccountEmail: email,
            previewAccountType: previewAccountType,
          },
        },
        onCompleted: ({ signupPreviewAccount }) => {
          console.log(signupPreviewAccount, "signupPreviewAccount");
          const { token, workspaceId, projectId, resourceId } =
            signupPreviewAccount;

          setToken(token);
          history.push(`/${workspaceId}/${projectId}/${resourceId}`);
        },
      }).catch(console.error);
    }
  }, [signupPreviewAccount, window.location.search]);

  const errorMessage = formatError(error);

  errorMessage && <p>{errorMessage}</p>;

  return loading && <p>Please wait...</p>;
};

export default SignupPreviewAccount;

const SIGNUP_PREVIEW_ACCOUNT = gql`
  mutation SignupPreviewAccount($data: SignupPreviewAccountInput!) {
    signupPreviewAccount(data: $data) {
      token
      workspaceId
      projectId
      resourceId
    }
  }
`;
