import { NotificationContext } from "./novuTypes";

export const novuPackage = async (notificationCtx: NotificationContext) => {
  try {
    if (!notificationCtx.notifications.length) return;

    for (const notification of notificationCtx.notifications) {
      const { notificationMethod, ...restNotification } = notification;

      await notificationMethod(restNotification);
    }
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);
  }
};
