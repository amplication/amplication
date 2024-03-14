import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { NotificationContext } from "../util/novuTypes";

const NOTIFICATION_KEY = "complete-preview-onboarding";

export const previewUserGenerationCompleted = async (
  notificationCtx: NotificationContext
) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !==
        KAFKA_TOPICS.USER_PREVIEW_GENERATION_COMPLETED_TOPIC
    )
      return notificationCtx;

    const { externalId, ...restParams } = notificationCtx.message;

    notificationCtx.notifications.push({
      notificationMethod:
        notificationCtx.novuService.triggerNotificationToSubscriber,
      subscriberId: externalId,
      eventName: NOTIFICATION_KEY,
      payload: {
        payload: {
          ...restParams,
        },
      },
    });

    return notificationCtx;
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);

    return notificationCtx;
  }
};
