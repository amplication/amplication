import {
  useMutation,
  useSubscription,
  useApolloClient,
  DocumentNode,
} from "@apollo/client";
import * as models from "../../models";
import {
  ASSISTANT_MESSAGE_UPDATED,
  SEND_ASSISTANT_MESSAGE,
} from "../queries/assistantQueries";
import { useCallback, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { GET_ENTITIES } from "../../Entity/EntityERD/EntitiesERD";

type TAssistantThreadData = {
  sendAssistantMessageWithStream: models.AssistantThread;
};

type TAssistantMessageUpdatedData = {
  assistantMessageUpdated: models.AssistantMessageDelta;
};

export type AssistantMessageWithOptions = models.AssistantMessage & {
  options?: string[];
  loading?: boolean;
};

const INITIAL_MESSAGE: AssistantMessageWithOptions = {
  text: `**Welcome! my name is Jovu.** 

  My goal is to assist you in building production-ready backend services easily and according to industry standards using Amplication. 
  This includes helping you navigate the features of Amplication, guiding you through the process of creating entities, services, configurations, and more within your projects. 
  
  You can ask me anything about Amplication, or use one of the following options to get started.`,

  role: models.EnumAssistantMessageRole.Assistant,
  id: "none",
  createdAt: "",
  options: [
    "Does Amplication auto-generate APIs?",
    "I want to create a new project with a couple of services. Can you help me?",
    "Can you recommend the plugins I should install for my Service for an event-driven architecture?",
    "What are the benefits that Amplication can provide to my backend services?",
  ],
};

const FUNCTIONS_CACHE_MAP: {
  [key in models.EnumAssistantFunctions]: {
    refreshPendingChanges: boolean;
    cacheKey: string;
    queries?: DocumentNode[];
  };
} = {
  [models.EnumAssistantFunctions.CreateEntities]: {
    refreshPendingChanges: true,
    cacheKey: "resources",
  },
  [models.EnumAssistantFunctions.CreateService]: {
    refreshPendingChanges: true,
    cacheKey: "resources",
  },
  [models.EnumAssistantFunctions.CreateProject]: {
    refreshPendingChanges: false,
    cacheKey: "projects",
  },
  [models.EnumAssistantFunctions.CommitProjectPendingChanges]: {
    refreshPendingChanges: true,
    cacheKey: "commits",
  },
  [models.EnumAssistantFunctions.CreateModule]: {
    refreshPendingChanges: true,
    cacheKey: "modules",
  },
  [models.EnumAssistantFunctions.CreateModuleDto]: {
    refreshPendingChanges: true,
    cacheKey: "moduleDtos",
  },
  [models.EnumAssistantFunctions.CreateModuleEnum]: {
    refreshPendingChanges: true,
    cacheKey: "moduleEnums",
  },
  [models.EnumAssistantFunctions.InstallPlugins]: {
    refreshPendingChanges: true,
    cacheKey: "pluginInstallations",
  },
  [models.EnumAssistantFunctions.CreateModuleAction]: {
    refreshPendingChanges: true,
    cacheKey: "moduleActions",
  },
  [models.EnumAssistantFunctions.CreateEntityFields]: {
    refreshPendingChanges: true,
    cacheKey: "fields",
    queries: [GET_ENTITIES],
  },
  [models.EnumAssistantFunctions.GetModuleActions]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetModuleDtosAndEnums]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetPlugins]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetProjectPendingChanges]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetProjectServices]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetServiceEntities]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
  [models.EnumAssistantFunctions.GetServiceModules]: {
    refreshPendingChanges: false,
    cacheKey: "",
  },
};

const useAssistant = () => {
  const { currentProject, currentResource, addBlock } = useAppContext();

  const apolloClient = useApolloClient();

  const updateCache = useCallback(
    (fieldName: string) => {
      apolloClient.refetchQueries({
        updateCache(cache) {
          cache.evict({ fieldName });
        },
      });
    },
    [apolloClient]
  );

  const [messages, setMessages] = useState<AssistantMessageWithOptions[]>([
    INITIAL_MESSAGE,
  ]);

  const [processingMessage, setProcessingMessage] = useState(false);

  const [threadId, setThreadId] = useState<string | null>(null);

  const [sendAssistantMessage] = useMutation<TAssistantThreadData>(
    SEND_ASSISTANT_MESSAGE,
    {
      onCompleted: (data) => {
        setThreadId(data.sendAssistantMessageWithStream.id);
        setMessages([
          ...messages,
          ...data.sendAssistantMessageWithStream.messages,
        ]);
      },
    }
  );

  const { error: streamError } = useSubscription<TAssistantMessageUpdatedData>(
    ASSISTANT_MESSAGE_UPDATED,
    {
      variables: {
        threadId,
      },
      skip: !threadId,
      onData: (data) => {
        const message = data.data.data.assistantMessageUpdated;
        const functionExecuted = message.functionExecuted;

        if (functionExecuted) {
          const cacheKey = FUNCTIONS_CACHE_MAP[functionExecuted].cacheKey;
          if (cacheKey) {
            updateCache(cacheKey);
          }
          if (FUNCTIONS_CACHE_MAP[functionExecuted].refreshPendingChanges) {
            addBlock("blockId");
          }

          const queries = FUNCTIONS_CACHE_MAP[functionExecuted].queries;
          if (queries) {
            apolloClient.refetchQueries({
              include: queries,
            });
          }

          return;
        }

        if (message.completed) {
          setProcessingMessage(false);
        }

        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          lastMessage.text = message.snapshot;
          lastMessage.loading = false; // remove loading indicator when first message is received
          return [...messages];
        });
      },
    }
  );

  const sendMessage = (message: string) => {
    const messageList = messages;

    if (messageList.length === 1) {
      messageList[0].options = undefined;
    }

    setMessages([
      ...messageList,
      {
        text: message,
        role: models.EnumAssistantMessageRole.User,
        id: Date.now().toString(),
        createdAt: "",
      },
      {
        text: "Thinking...",
        role: models.EnumAssistantMessageRole.Assistant,
        id: Date.now().toString() + "_",
        createdAt: "",
        loading: true,
      },
    ]);

    setProcessingMessage(true);

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
      const lastMessage = messages[messages.length - 1];

      lastMessage.loading = false;
      setMessages([
        ...messages,
        {
          text: "I'm sorry, I had a problem processing your request.",
          role: models.EnumAssistantMessageRole.Assistant,
          id: Date.now().toString() + "_",
          createdAt: "",
        },
        {
          text: error.message,
          role: models.EnumAssistantMessageRole.Assistant,
          id: Date.now().toString() + "_",
          createdAt: "",
        },
      ]);

      setProcessingMessage(false);
    });
  };

  return {
    sendMessage,
    messages,
    streamError,
    processingMessage,
  };
};

export default useAssistant;
