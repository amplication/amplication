import { gql } from "@apollo/client";

export const CREATE_COMPONENT = gql`
  mutation createComponent($data: ResourceCreateInput!) {
    createComponent(data: $data) {
      id
      name
      description
    }
  }
`;
