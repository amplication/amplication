import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ISubscriberPayload } from "@novu/node";

export interface NovuService {
  createSubscriber: (obj: {
    subscriberId: string;
    payload: ISubscriberPayload;
  }) => Promise<void>;
  updateSubscriber: (obj: {
    subscriberId: string;
    payload: ISubscriberPayload;
  }) => Promise<void>;
  deleteSubscriber: (obj: { subscriberId: string }) => void;
  triggerNotificationToSubscriber: (obj: {
    subscriberId: string;
    eventName: string;
    payload?: { [key: string]: any };
  }) => Promise<void>;
  broadCastEventToAll: (obj: {
    eventName: string;
    payload?: { [key: string]: any };
  }) => Promise<void>;
  addSubscribersToTopic: (obj: {
    topicKey: string;
    subscribersIds: string[];
  }) => Promise<void>;
  removeSubscribersFromTopic: (obj: {
    topicKey: string;
    subscribersIds: string[];
  }) => Promise<void>;
}

export interface Notification {
  notificationMethod: (obj: { [key: string]: any }) => void;
  subscriberId?: string | string[];
  eventName?: string;
  topicKey?: string;
  payload?: { [key: string]: any } | ISubscriberPayload;
}

export interface NotificationContext {
  message: { [key: string]: any };
  topic: string;
  novuService: NovuService;
  amplicationLogger: AmplicationLogger;
  notifications: Notification[];
}
