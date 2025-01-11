import { gql } from "@apollo/client";

export const GET_CURRENT_WORKSPACE = gql`
  query getCurrentWorkspace {
    currentWorkspace {
      id
      name
      allowLLMFeatures
      externalId
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
      gitOrganizations {
        id
        name
        installationId
        type
        provider
        useGroupingForRepositories
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

export const CREATE_WORKSPACE = gql`
  mutation createWorkspace($data: WorkspaceCreateInput!) {
    createWorkspace(data: $data) {
      id
      name
    }
  }
`;

export const NEW_WORKSPACE_FRAGMENT = gql`
  fragment NewWorkspace on Workspace {
    id
    name
  }
`;

export const GET_WORKSPACES = gql`
  query getWorkspaces {
    workspaces {
      id
      name
      subscription {
        id
        subscriptionPlan
        status
      }
    }
  }
`;

export const GET_CONTACT_US_LINK = gql`
  query GetContactUsLink($id: String!) {
    contactUsLink(where: { id: $id })
  }
`;

export const PROVISION_SUBSCRIPTION = gql`
  mutation provisionSubscription($data: ProvisionSubscriptionInput!) {
    provisionSubscription(data: $data) {
      provisionStatus
      checkoutUrl
    }
  }
`;

export const GET_PERMISSIONS = gql`
  query permissions {
    permissions
  }
`;
