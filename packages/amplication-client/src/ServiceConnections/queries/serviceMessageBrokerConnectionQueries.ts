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
      patterns {
        topicId
        type
      }
    }
  }
`;

export const UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION = gql`
  mutation updateServiceMessageBrokerConnection(
    $data: ServiceMessageBrokerConnectionUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateServiceMessageBrokerConnection(data: $data, where: $where) {
      id
      displayName
      messageBrokerId
      enabled
      patterns {
        topicId
        type
      }
    }
  }
`;

export const CREATE_SERVICE_MESSAGE_BROKER_CONNECTION = gql`
  mutation createServiceMessageBrokerConnection(
    $data: ServiceMessageBrokerConnectionCreateInput!
  ) {
    createServiceMessageBrokerConnection(data: $data) {
      id
      displayName
      messageBrokerId
      enabled
      patterns {
        topicId
        type
      }
    }
  }
`;
