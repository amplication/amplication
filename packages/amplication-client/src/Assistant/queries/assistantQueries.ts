import { gql } from "@apollo/client";

export const SEND_ASSISTANT_MESSAGE = gql`
  mutation sendAssistantMessage(
    $data: SendAssistantMessageInput!
    $context: AssistantContext!
  ) {
    sendAssistantMessage(data: $data, context: $context) {
      id
      messages {
        id
        role
        text
        createdAt
      }
    }
  }
`;
