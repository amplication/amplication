import { gql } from "@apollo/client";

export const SIGNUP_WITH_BUSINESS_EMAIL = gql`
  mutation signupWithBusinessEmail($data: SignupWithBusinessEmailInput!) {
    signupWithBusinessEmail(data: $data)
  }
`;
