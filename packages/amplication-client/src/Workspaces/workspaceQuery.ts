import { gql } from "@apollo/client";

export const GET_CURRENT_WORKSPACE = gql`
  query getCurrentWorkspace {
    currentWorkspace {
      id
      name
      subscription {
        id
        workspaceId
        subscriptionPlan
        status
        nextBillDate
        cancelUrl
        updateUrl
        price
        cancellationEffectiveDate
      }
    }
  }
`;

export const SET_CURRENT_WORKSPACE = gql`
mutation setCurrentWorkspace($workspaceId: String!) {
  setCurrentWorkspace(data: { id: $workspaceId }) {
    token
  }
}
`;