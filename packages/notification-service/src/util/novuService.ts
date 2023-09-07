import { Injectable } from "@nestjs/common";
import { ISubscriberPayload, Novu } from "@novu/node";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class NovuService {
  static novuInstance = new Novu(process.env.NOVU_API_KEY as string);
  static logger = new AmplicationLogger({
    component: "notification-service",
  });

  async createSubscriber(obj: {
    subscriberId: string;
    payload: ISubscriberPayload;
  }) {
    try {
      const { subscriberId, payload } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in createSubscriber !");

      const createSubscriberRes =
        await NovuService.novuInstance.subscribers.identify(
          subscriberId,
          payload
        );

      await NovuService.logger.info(
        "createSubscriber",
        createSubscriberRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error createSubscriber", error);
    }
  }

  async updateSubscriber(obj: {
    subscriberId: string;
    payload: ISubscriberPayload;
  }) {
    try {
      const { subscriberId, payload } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in updateSubscriber !");

      const updateSubscriberRes =
        await NovuService.novuInstance.subscribers.update(
          subscriberId,
          payload
        );
      await NovuService.logger.info(
        "updateSubscriber",
        updateSubscriberRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error updateSubscriber", error);
    }
  }

  async deleteSubscriber(obj: { subscriberId: string }) {
    try {
      const { subscriberId } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in deleteSubscriber !");

      const deleteSubscriberRes =
        await NovuService.novuInstance.subscribers.delete(subscriberId);

      await NovuService.logger.info(
        "deleteSubscriber",
        deleteSubscriberRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error deleteSubscriber", error);
    }
  }

  async triggerNotificationToSubscriber(obj: {
    subscriberId: string;
    eventName: string;
    payload?: { [key: string]: any };
  }) {
    try {
      const { subscriberId, eventName, payload } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in triggerNotification !");

      if (!eventName)
        throw Error("eventName is missing in triggerNotification !");

      const triggerNotificationRes = await NovuService.novuInstance.trigger(
        eventName,
        {
          to: {
            subscriberId,
          },
          payload: payload,
        }
      );

      await NovuService.logger.info(
        "triggerNotificationToSubscriber",
        triggerNotificationRes.data
      );
    } catch (error) {
      await NovuService.logger.error(
        "error triggerNotificationToSubscriber",
        error
      );
    }
  }

  async broadCastEventToAll(obj: {
    eventName: string;
    payload?: { [key: string]: any };
  }) {
    try {
      const { eventName, payload } = obj;
      if (!eventName)
        throw Error("eventName is missing in broadCastEventToAll !");

      const broadCastNotificationRes = await NovuService.novuInstance.broadcast(
        eventName,
        {
          payload,
        }
      );

      await NovuService.logger.info(
        "broadCastEventToAll",
        broadCastNotificationRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error broadCastEventToAll", error);
    }
  }

  async addSubscribersToTopic(obj: {
    topicKey: string;
    subscribersIds: string[];
  }) {
    try {
      const { topicKey, subscribersIds } = obj;
      if (!topicKey)
        throw Error("topicKey is missing in addSubscribersToTopic !");

      const addSubscribersRes =
        await NovuService.novuInstance.topics.addSubscribers(topicKey, {
          subscribers: subscribersIds,
        });

      await NovuService.logger.info(
        "addSubscribersToTopic",
        addSubscribersRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error addSubscribersToTopic", error);
    }
  }

  async removeSubscribersFromTopic(obj: {
    topicKey: string;
    subscribersIds: string[];
  }) {
    try {
      const { topicKey, subscribersIds } = obj;
      if (!topicKey)
        throw Error("topicKey is missing in removeSubscribersFromTopic !");

      const removeSubscribersRes =
        await NovuService.novuInstance.topics.removeSubscribers(topicKey, {
          subscribers: subscribersIds,
        });
      await NovuService.logger.info(
        "removeSubscribersFromTopic",
        removeSubscribersRes.data
      );
    } catch (error) {
      await NovuService.logger.error("error removeSubscribersFromTopic", error);
    }
  }
}
