import { gql } from "@apollo/client";

export const SIGNUP_PREVIEW_ACCOUNT = gql`
  mutation SignupPreviewAccount($data: SignupPreviewAccountInput!) {
    signupPreviewAccount(data: $data) {
      token
      workspaceId
      projectId
      resourceId
    }
  }
`;
