import { gql } from "@apollo/client";

export const TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES = gql`
  mutation TriggerBreakServiceIntoMicroservices($resourceId: String!) {
    triggerBreakServiceIntoMicroservices(resourceId: $resourceId) {
      id
    }
  }
`;

export const FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES = gql`
  query FinalizeBreakServiceIntoMicroservices($userActionId: String!) {
    finalizeBreakServiceIntoMicroservices(userActionId: $userActionId) {
      data {
        microservices {
          name
          functionality
          tables {
            originalEntityId
            name
          }
        }
      }
      status
      originalResourceId
    }
  }
`;
