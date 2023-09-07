import { Inject, Injectable } from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { NovuService } from "./util/novuService";
import { novuPackage } from "./util/novuPackage";
import { subscribeUser } from "./notification-packages/subscribeUser";
import { buildCompleted } from "./notification-packages/buildCompleted";
import { NotificationContext } from "./util/novuTypes";

type NotificationPackageFunc = (
  ctx: NotificationContext
) => Promise<typeof ctx> | Promise<void>;

const compose =
  (...fns: NotificationPackageFunc[]) =>
  (x: NotificationContext) =>
    fns.reduce(async (y, f) => f(await y), Promise.resolve(x));

@Injectable()
export class AppService {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly novuService: NovuService
  ) {}
  async notificationService(message: { [key: string]: any }, topic: string) {
    return compose(
      subscribeUser,
      buildCompleted,
      novuPackage
    )({
      message,
      topic,
      novuService: this.novuService,
      amplicationLogger: this.logger,
      notifications: [],
    });
  }
}
