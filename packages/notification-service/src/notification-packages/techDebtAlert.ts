import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { format } from "date-fns";
import { NotificationContext } from "../util/novuTypes";

export const techDebtAlert = async (notificationCtx: NotificationContext) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !== KAFKA_TOPICS.TECH_DEBT_CREATED_TOPIC
    )
      return notificationCtx;

    const { externalId, ...restParams } = notificationCtx.message;

    notificationCtx.notifications.push({
      notificationMethod:
        notificationCtx.novuService.triggerNotificationToSubscriber,
      subscriberId: externalId,
      eventName: "technical-debt-alert",
      payload: {
        payload: {
          ...restParams,
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
