import { NotificationContext } from "../util/novuTypes";

export const buildTest = async (notificationCtx: NotificationContext) => {
  try {
    if (!notificationCtx.message) return;

    for (const notification of notificationCtx.notifications) {
      const { notificationMethod, ...restNotification } = notification;

      await notificationCtx.novuService[notificationMethod](restNotification);
    }
  } catch (error) {
    notificationCtx.amplicationLogger.error(error.message, error);
  }
};
