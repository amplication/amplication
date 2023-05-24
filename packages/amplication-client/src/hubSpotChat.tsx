import { Icon } from "@amplication/ui/design-system";
import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "./context/appContext";
import "./hubSpotChat.scss";
import { useTracking } from "./util/analytics";
import { AnalyticsEventNames } from "./util/analytics-events.types";

export const onConversationsAPIReady = () => {
  window.HubSpotConversations.on("conversationClosed", (payload) => {
    console.log(
      `Conversation with id ${payload.conversation.conversationId} has been closed!`
    );
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
  const { trackEvent } = useTracking();
  const { currentWorkspace } = useContext(AppContext);
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
    trackEvent({
      eventName: AnalyticsEventNames.ChatWidgetClose,
      workspaceId: currentWorkspace.id,
    });
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
