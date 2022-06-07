import React, { useContext } from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import ThemeContext from "../Layout/ThemeContext";

const THEME_DARK = "dark";
const THEME_LIGHT = "light";

export function Notifications() {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext.theme === THEME_DARK;

  const onNotificationClick = (notification: IMessage) => {
    navigator(notification.cta.data.url as string);
    // downloadArchive(notification.cta.data.url as string);
  };

  return (
    <NovuProvider
      subscriberId="{process.env.NOVU_SAMPLE_USER_ID}"
      applicationIdentifier="{process.env.NOVU_APP_ID_FROM_ADMIN_PANEL}"
    >
      <PopoverNotificationCenter
        colorScheme={isDarkMode ? THEME_DARK : THEME_LIGHT}
        onNotificationClick={onNotificationClick}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
