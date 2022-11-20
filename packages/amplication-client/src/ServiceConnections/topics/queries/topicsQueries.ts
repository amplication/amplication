import { gql } from "@apollo/client";

export const topicsOfBroker = gql`
  query Topics($messageBrokerId: String!) {
    Topics(
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
