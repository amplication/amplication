import { Injectable } from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { NovuService } from "./util/novuService";
import { novuPackage } from "./util/novuPackage";
import { subscribeUser } from "./notification-packages/subscribeUser";
import { buildCompleted } from "./notification-packages/buildCompleted";

const compose =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);

@Injectable()
export class AppService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly novuService: NovuService
  ) {}
  async notificationService(message: { [key: string]: any }, topic: string) {
    return await compose(
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
