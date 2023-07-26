import { KafkaContext } from "@nestjs/microservices";
import { promisify } from "util";

export class KafkaPacemaker {
  static async wrapLongRunningMethod<T>(
    kafkaContext: KafkaContext,
    fn: () => Promise<T>,
    timeout = 3000
  ) {
    const heartbeat = kafkaContext.getHeartbeat();
    const sleep = promisify(setTimeout);
    let isFnDone = false;

    const wrappedFn = async () => {
      const result = await fn();
      isFnDone = true;
      return result;
    };

    const fnPromise = wrappedFn();

    while (!isFnDone) {
      await Promise.race([fnPromise, sleep(timeout)]);
      try {
        await heartbeat();
      } catch (error) {
        // swallow the error as we don't want to fail the fn() because of a heartbeat failure
      }
    }

    return await fnPromise;
  }
}
