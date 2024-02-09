import { EnumMessageType } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";

export { EnumMessageType };

export type MessageWithType = {
  message: string;
  type: EnumMessageType;
};

const useMessage = () => {
  const [message, setMessage] = useState<MessageWithType | null>(null);

  const showMessage = useCallback((message: string, type: EnumMessageType) => {
    setMessage({ message, type });
  }, []);

  const removeMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message: message?.message,
    messageType: message?.type,
    showMessage,
    removeMessage,
  };
};

export default useMessage;
