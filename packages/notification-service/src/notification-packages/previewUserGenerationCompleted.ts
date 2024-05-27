import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { NotificationContext } from "../util/novuTypes";

const NOTIFICATION_KEY = "complete-preview-onboarding";
const SENDGRID_TEMPLATE_ID = "d-f8d34551e2c7436681b34f8af0782788";

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
      payload: {},
      overrides: {
        sendgrid: {
          customData: {
            // sendgrid template templateId
            templateId: SENDGRID_TEMPLATE_ID,
            // sendgrid template variables
            dynamicTemplateData: {
              ...restParams,
            },
          },
        },
      },
    });

    return notificationCtx;
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);

    return notificationCtx;
  }
};
