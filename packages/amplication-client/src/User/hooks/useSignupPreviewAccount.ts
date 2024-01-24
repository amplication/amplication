import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_PREVIEW_ACCOUNT } from "../UserQueries";
import { setToken } from "../../authentication/authentication";
import { EnumPreviewAccountType } from "../../models";
import { useHistory } from "react-router-dom";

type TData = {
  signupPreviewAccount: {
    token: string;
    workspaceId: string;
    resourceId: string;
    projectId: string;
  };
};

const useSignupPreviewAccount = (
  email: string,
  previewAccountType: EnumPreviewAccountType
) => {
  const history = useHistory();

  const [signupPreviewAccount, { loading, error }] = useMutation<TData>(
    SIGNUP_PREVIEW_ACCOUNT
  );

  useEffect(() => {
    if (email && previewAccountType) {
      signupPreviewAccount({
        variables: {
          data: {
            previewAccountEmail: email,
            previewAccountType,
          },
        },
        onCompleted: ({ signupPreviewAccount }) => {
          const { token, workspaceId, projectId, resourceId } =
            signupPreviewAccount;
          setToken(token);
          history.push(
            `/${workspaceId}/${projectId}/${resourceId}/breaking-the-monolith-options`
          );
        },
      }).catch(console.error);
    }
  }, [email, previewAccountType]);

  return { loading, error };
};

export default useSignupPreviewAccount;
