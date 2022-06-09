import React, { useContext } from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import ThemeContext from "../Layout/ThemeContext";
import { useQuery, gql } from "@apollo/client";
import * as models from "../models";

type TData = {
  me: models.User;
};

const THEME_DARK = "dark";
const THEME_LIGHT = "light";

export function Notifications() {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext.theme === THEME_DARK;
  const { data } = useQuery<TData>(AUTH_QUERY);

  const onNotificationClick = (notification: IMessage) => {
    navigator(notification.cta.data.url as string);
  };

  return data ? (
    <NovuProvider
      subscriberId={data.me.id}
      applicationIdentifier={
        process.env.REACT_APP_NOVU_APP_ID_FROM_ADMIN_PANEL!
      }
    >
      <PopoverNotificationCenter
        colorScheme={isDarkMode ? THEME_DARK : THEME_LIGHT}
        onNotificationClick={onNotificationClick}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  ) : null;
}

export const AUTH_QUERY = gql`
  query auth {
    me {
      id
    }
  }
`;
