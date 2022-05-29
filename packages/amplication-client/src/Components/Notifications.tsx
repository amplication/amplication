import React from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

export function Notifications() {
  return (
    <NovuProvider
      colorScheme={"dark" || "light"}
      subscriberId={process.env.NOVU_SAMPLE_USE_ID}
      applicationIdentifier={process.env.NOVU_APP_ID_FROM_ADMIN_PANEL!}
    >
      <PopoverNotificationCenter>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
