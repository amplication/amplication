import React from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

export function Notification() {
  return (
    <NovuProvider
      subscriberId={"cl3r1c72x0090kfp512158a4f"}
      colorScheme={"dark" || "light"}
      applicationIdentifier={"qBrB-jRV8iOp"}
    >
      <PopoverNotificationCenter>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
