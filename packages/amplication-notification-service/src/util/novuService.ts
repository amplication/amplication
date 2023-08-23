import { Injectable } from "@nestjs/common";
import { Novu } from "@novu/node";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { UserDetails } from "./novuTypes";

@Injectable()
export class NovuService {
  #novuInstance;

  constructor(private readonly logger: AmplicationLogger) {
    this.#novuInstance = new Novu(process.env.NOVU_API_KEY);
  }

  async createSubscriber(obj: { subscriberId: string; payload: UserDetails }) {
    try {
      const { subscriberId, payload } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in createSubscriber !");

      const createSubscriberRes = await this.#novuInstance.identify(
        subscriberId,
        payload
      );
      this.logger.info(createSubscriberRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async updateSubscriber(obj: { subscriberId: string; payload: UserDetails }) {
    try {
      const { subscriberId, payload } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in updateSubscriber !");

      const updateSubscriberRes = await this.#novuInstance.update(
        subscriberId,
        payload
      );
      this.logger.info(updateSubscriberRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async deleteSubscriber(obj: { subscriberId: string }) {
    try {
      const { subscriberId } = obj;
      if (!subscriberId)
        throw Error("subscriberId is missing in deleteSubscriber !");

      const deleteSubscriberRes = await this.#novuInstance.delete(subscriberId);
      this.logger.info(deleteSubscriberRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
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

      const triggerNotificationRes = await this.#novuInstance.trigger(
        eventName,
        {
          to: {
            subscriberId,
          },
          payload: payload,
        }
      );

      this.logger.info(triggerNotificationRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
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

      const broadCastNotificationRes = await this.#novuInstance.broadcast(
        eventName,
        {
          payload,
        }
      );

      this.logger.info(broadCastNotificationRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
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

      const addSubscribersRes = await this.#novuInstance.topics.addSubscribers(
        topicKey,
        {
          subscribers: subscribersIds,
        }
      );

      this.logger.info(addSubscribersRes);
    } catch (error) {
      this.logger.error(error.message, error);
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
        await this.#novuInstance.topics.removeSubscribers(topicKey, {
          subscribers: subscribersIds,
        });
      this.logger.info(removeSubscribersRes);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
