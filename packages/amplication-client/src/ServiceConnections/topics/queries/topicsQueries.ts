import { gql } from "@apollo/client";

export const GET_TOPICS_OF_BROKER = gql`
  query topics($messageBrokerId: String!) {
    topics(
      where: { resource: { id: $messageBrokerId } }
      orderBy: { createdAt: Asc }
    ) {
      id
      name
      displayName
      description
    }
  }
`;

export const DELETE_TOPIC = gql`
  mutation deleteTopic($where: WhereUniqueInput!) {
    deleteTopic(where: $where) {
      id
    }
  }
`;
