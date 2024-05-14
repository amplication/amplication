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

const PREVIEW_ACCOUNT_TYPE_TO_URL = {
  [EnumPreviewAccountType.BreakingTheMonolith]: "/select-preview-env",
  [EnumPreviewAccountType.PreviewOnboarding]: "/onboarding-preview",
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
          localStorage.removeItem("disableSelectPreviewEnvPage");
          const { token, workspaceId, projectId, resourceId } =
            signupPreviewAccount;
          setToken(token);

          history.push({
            pathname: PREVIEW_ACCOUNT_TYPE_TO_URL[previewAccountType],
            search: `?resourceId=${resourceId}&projectId=${projectId}&workspaceId=${workspaceId}`,
          });
        },
      }).catch(console.error);
    }
  }, [email, history, previewAccountType, signupPreviewAccount]);

  return { loading, error };
};

export default useSignupPreviewAccount;
