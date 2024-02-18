import { gql } from "@apollo/client";

export const SIGNUP_PREVIEW_ACCOUNT = gql`
  mutation signupPreviewAccount($data: SignupPreviewAccountInput!) {
    signupPreviewAccount(data: $data) {
      token
      workspaceId
      projectId
      resourceId
    }
  }
`;

export const SIGNUP_WITH_BUSINESS_EMAIL = gql`
  mutation signupWithBusinessEmail($data: SignupWithBusinessEmailInput!) {
    signupWithBusinessEmail(data: $data)
  }
`;

export const COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL = gql`
  mutation CompleteSignupWithBusinessEmail {
    completeSignupWithBusinessEmail
  }
`;
