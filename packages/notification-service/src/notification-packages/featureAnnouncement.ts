import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { NotificationContext } from "../util/novuTypes";

export const featureAnnouncement = async (
  notificationCtx: NotificationContext
) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !== KAFKA_TOPICS.USER_ANNOUNCEMENT_TOPIC
    )
      return notificationCtx;

    const { externalId, notificationTemplateIdentifier, ...restParams } =
      notificationCtx.message;

    notificationCtx.notifications.push({
      notificationMethod:
        notificationCtx.novuService.triggerNotificationToSubscriber,
      subscriberId: externalId,
      eventName: notificationTemplateIdentifier,
      payload: {
        payload: {
          ...restParams, //envBaseUrl, workspaceId, projectId, serviceId
        },
      },
    });
  } catch (error) {
    notificationCtx.amplicationLogger.error(error.message, error);
  }
  return notificationCtx;
};
