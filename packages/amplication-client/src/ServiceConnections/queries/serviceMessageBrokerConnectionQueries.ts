import { gql } from "@apollo/client";

export const GET_SERVICE_MESSAGE_BROKER_CONNECTIONS = gql`
  query ServiceMessageBrokerConnections($resourceId: String!) {
    ServiceMessageBrokerConnections(
      where: { resource: { id: $resourceId } }
      orderBy: { createdAt: Asc }
    ) {
      id
      displayName
      messageBrokerId
      enabled
    }
  }
`;
