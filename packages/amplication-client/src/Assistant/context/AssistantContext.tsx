import React, { useState } from "react";
import useAssistant, {
  AssistantMessageWithOptions,
} from "../hooks/useAssistant";
import { ApolloError } from "@apollo/client";

export interface AssistantContextInterface {
  open: boolean;
  setOpen: (open: boolean) => void;
  widthState: string;
  setWidthState: (widthState: "default" | "wide") => void;
  sendMessage: (message: string) => void;
  messages: AssistantMessageWithOptions[];
  streamError: ApolloError;
  processingMessage: boolean;
}

const initialContext: AssistantContextInterface = {
  open: false,
  setOpen: () => {},
  widthState: "default",
  setWidthState: () => {},
  sendMessage: () => {},
  messages: [],
  streamError: null,
  processingMessage: false,
};

export const AssistantContext =
  React.createContext<AssistantContextInterface>(initialContext);

export const AssistantContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [widthState, setWidthState] = useState<string>("default");

  const { sendMessage, messages, streamError, processingMessage } =
    useAssistant();

  const contextValue = {
    open,
    setOpen,
    widthState,
    setWidthState,
    sendMessage,
    messages,
    streamError,
    processingMessage,
  };

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistantContext = () => {
  const context = React.useContext(AssistantContext);
  if (context === undefined)
    throw Error(
      "useAssistantContext must be used within a AssistantContextProvider"
    );

  return context;
};
