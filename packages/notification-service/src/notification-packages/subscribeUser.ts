import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { NotificationContext } from "../util/novuTypes";

export const subscribeUser = async (notificationCtx: NotificationContext) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !== KAFKA_TOPICS.USER_ACTION_TOPIC
    )
      return notificationCtx;

    const { externalId, enableUser, ...restAccount } = notificationCtx.message;
    notificationCtx.notifications.push({
      notificationMethod: enableUser
        ? notificationCtx.novuService.createSubscriber
        : notificationCtx.novuService.deleteSubscriber,
      subscriberId: externalId,
      payload: restAccount,
    });

    return notificationCtx;
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);

    return notificationCtx;
  }
};
