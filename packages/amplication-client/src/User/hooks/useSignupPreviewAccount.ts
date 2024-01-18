import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_WITH_BUSINESS_EMAIL_PREVIEW } from "../UserQueries";
import { setToken } from "../../authentication/authentication";
import { PreviewAccountType } from "../../models";
import { useHistory } from "react-router-dom";

type TData = {
  signUpWithBusinessEmail: {
    token: string;
    workspaceId: string;
    resourceId: string;
    projectId: string;
  };
};

const useSignupPreviewAccount = (
  email: string,
  previewAccountType: PreviewAccountType
) => {
  const history = useHistory();

  const [signUpWithBusinessEmail, { loading, error }] = useMutation<TData>(
    SIGNUP_WITH_BUSINESS_EMAIL_PREVIEW
  );

  useEffect(() => {
    if (email && previewAccountType) {
      signUpWithBusinessEmail({
        variables: {
          data: {
            previewAccountEmail: email,
            previewAccountType,
          },
        },
        onCompleted: ({ signUpWithBusinessEmail }) => {
          const { token, workspaceId, projectId, resourceId } =
            signUpWithBusinessEmail;
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
