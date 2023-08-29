import { Inject, Injectable } from "@nestjs/common";
import { ISubscriberPayload, Novu } from "@novu/node";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class NovuService {
  static novuInstance = new Novu(process.env.NOVU_API_KEY as string);

  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

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
      console.log(createSubscriberRes.data);
      // this.logger.info(createSubscriberRes.data);
    } catch (error) {
      console.log(error.message);
      // this.logger.error(error.message, error);
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

      const deleteSubscriberRes =
        await NovuService.novuInstance.subscribers.delete(subscriberId);
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

      const triggerNotificationRes = await NovuService.novuInstance.trigger(
        eventName,
        {
          to: {
            subscriberId,
          },
          payload: payload,
        }
      );

      // console.log(triggerNotificationRes.data);
      await this.logger.info(triggerNotificationRes.data);
    } catch (error) {
      // console.log(error.message, error)
      await this.logger.error(error.message, error);
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

      const addSubscribersRes =
        await NovuService.novuInstance.topics.addSubscribers(topicKey, {
          subscribers: subscribersIds,
        });

      this.logger.info(addSubscribersRes.data);
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
        await NovuService.novuInstance.topics.removeSubscribers(topicKey, {
          subscribers: subscribersIds,
        });
      this.logger.info(removeSubscribersRes.data);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
