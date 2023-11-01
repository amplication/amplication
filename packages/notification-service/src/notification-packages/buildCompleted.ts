import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { format } from "date-fns";
import { NotificationContext } from "../util/novuTypes";

export const buildCompleted = async (notificationCtx: NotificationContext) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !== KAFKA_TOPICS.USER_BUILD_TOPIC
    )
      return notificationCtx;

    const { externalId, ...restParams } = notificationCtx.message;
    const shortBuildId = restParams?.buildId.slice(-8);

    notificationCtx.notifications.push({
      notificationMethod:
        notificationCtx.novuService.triggerNotificationToSubscriber,
      subscriberId: externalId,
      eventName: "build-completed",
      payload: {
        payload: {
          ...restParams,
          shortBuildId,
          createdAt: `${format(
            new Date(restParams?.createdAt),
            "E LLL dd yyyy hh:mm a zzzz"
          )}`,
        },
      },
    });

    return notificationCtx;
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);

    return notificationCtx;
  }
};
