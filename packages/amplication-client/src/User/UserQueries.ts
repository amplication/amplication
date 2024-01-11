import { gql } from "@apollo/client";

export const SIGNUP_WITH_BUSINESS_EMAIL_PREVIEW = gql`
  mutation SignUpWithBusinessEmail($data: SignupPreviewAccountInput!) {
    signUpWithBusinessEmail(data: $data) {
      token
      workspaceId
      projectId
      resourceId
      message
    }
  }
`;
