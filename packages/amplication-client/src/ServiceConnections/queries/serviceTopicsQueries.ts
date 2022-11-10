import { gql } from "@apollo/client";

export const GET_SERVICE_MESSAGE_BROKER_CONNECTIONS = gql`
  query ServiceTopicsList($resourceId: String!) {
    ServiceTopicsList(
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
  mutation updateServiceTopics(
    $data: ServiceTopicsUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateServiceTopics(data: $data, where: $where) {
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
  mutation createServiceTopics($data: ServiceTopicsCreateInput!) {
    createServiceTopics(data: $data) {
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
