import { gql } from "@apollo/client";

export const SEND_ASSISTANT_MESSAGE = gql`
  mutation sendAssistantMessageWithStream(
    $data: SendAssistantMessageInput!
    $context: AssistantContext!
  ) {
    sendAssistantMessageWithStream(data: $data, context: $context) {
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

export const ASSISTANT_MESSAGE_UPDATED = gql`
  subscription AssistantMessageUpdated($threadId: String!) {
    assistantMessageUpdated(threadId: $threadId) {
      id
      threadId
      snapshot
      text
      completed
      functionExecuted
    }
  }
`;
