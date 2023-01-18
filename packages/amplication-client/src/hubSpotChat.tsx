import { Icon } from "@amplication/design-system";
import React, { useCallback, useEffect } from "react";
import "./hubSpotChat.scss";

export const onConversationsAPIReady = () => {
  window.HubSpotConversations.on("conversationClosed", (payload) => {
    console.log(
      `Conversation with id ${payload.conversation.conversationId} has been closed!`
    );
    window.HubSpotConversations.widget.remove();
  });
  const handleEvent = (eventPayload) => {
    console.log(eventPayload);
  };

  window.HubSpotConversations.on("conversationStarted", handleEvent);
};

export const HubSpotChatComponent: React.FC<{
  chatStatus: boolean;
  setChatStatus: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ chatStatus = false, setChatStatus }) => {
  useEffect(() => {
    window.hsConversationsSettings = {
      loadImmediately: chatStatus,
      inlineEmbedSelector: "#amplication-chat",
    };

    if (window.HubSpotConversations) {
      onConversationsAPIReady();
    } else {
      window.hsConversationsOnReady = [onConversationsAPIReady];
    }
    return () => {
      window.HubSpotConversations &&
        window.HubSpotConversations.widget &&
        window.HubSpotConversations.widget.remove();
    };
  }, []);

  const handleCloseChat = useCallback(() => {
    window.HubSpotConversations.widget.remove();
    setChatStatus(false);
  }, []);

  return (
    chatStatus && (
      <div id="amplication-chat">
        <div className="hubspot-close-btn" onClick={handleCloseChat}>
          <Icon icon="close" />
        </div>
      </div>
    )
  );
};
