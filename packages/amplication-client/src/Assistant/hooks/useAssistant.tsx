import { useMutation } from "@apollo/client";
import * as models from "../../models";
import { SEND_ASSISTANT_MESSAGE } from "../queries/assistantQueries";
import { useState } from "react";
import { useAppContext } from "../../context/appContext";

type TAssistantThreadData = {
  sendAssistantMessage: models.AssistantThread;
};

const INITIAL_MESSAGE: models.AssistantMessage = {
  text: "Welcome, how can I help you?",
  role: models.EnumAssistantMessageRole.Assistant,
  id: "none",
  createdAt: "",
};

const useAssistant = () => {
  const { currentProject, currentResource, addBlock } = useAppContext();

  const [messages, setMessages] = useState<models.AssistantMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const [
    sendAssistantMessage,
    { error: sendMessageError, loading: sendMessageLoading },
  ] = useMutation<TAssistantThreadData>(SEND_ASSISTANT_MESSAGE, {
    onCompleted: (data) => {
      setThreadId(data.sendAssistantMessage.id);
      setMessages([...messages, ...data.sendAssistantMessage.messages]);
      addBlock("blockid");
    },
  });

  const sendMessage = (message: string) => {
    setMessages([
      ...messages,
      {
        text: message,
        role: models.EnumAssistantMessageRole.User,
        id: "none",
        createdAt: "",
      },
    ]);

    sendAssistantMessage({
      variables: {
        data: {
          message,
          threadId,
        },
        context: {
          projectId: currentProject?.id,
          resourceId: currentResource?.id,
        },
      },
    }).catch((error) => {
      console.error(error);
    });
  };

  return {
    sendMessage,
    messages,
    sendMessageError,
    sendMessageLoading,
  };
};

export default useAssistant;
